import React, { useState, useEffect } from "react";
import {
  CalendarIcon,
  SearchIcon,
  UserCircleIcon,
} from "@heroicons/react/outline";
import { ArticleInterface } from "./models";
import { DateTime } from "luxon";
import axios from "axios";

const App = () => {
  const [articles, setArticles] = useState<ArticleInterface[]>([]);
  const [query, setQuery] = useState("React");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = setTimeout(async () => {
      await axios
        .get("https://hn.algolia.com/api/v1/search", {
          params: {
            query: query,
            hitsPerPage: 10,
            restrictSearchableAttributes: "title,author,url",
          },
        })
        .then(function (response) {
          const filteredArticles = response.data.hits.filter(
            (article: ArticleInterface) => article.url && article.title
          );

          setArticles(filteredArticles);

          setIsLoading(false);
        })
        .catch(function (error) {
          console.log(error);
        });
    }, 500);

    return () => {
      setIsLoading(true);
      clearTimeout(fetchData);
    };
  }, [query]);

  const onChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const formatDate = (date: string) => {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED);
  };

  const hasArticles = articles.length > 0;

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-gray-50">
      <main className="flex-grow py-12 ">
        <div className="flex flex-col max-w-md mx-auto space-y-12 sm:max-w-2xl">
          <h1 className="logo">React Micro Library</h1>

          <label className="search-box">
            <span className="sr-only">Search</span>
            <span className="icon">
              <SearchIcon className="w-5 h-5 text-gray-400" />
            </span>
            <input
              placeholder="Search articles by title or author..."
              type="text"
              name="search"
              onChange={onChangeQuery}
            />
          </label>

          <div className="articles">
            {isLoading && <h2 className="info">Loading...</h2>}

            {!hasArticles && !isLoading && (
              <h2 className="info">No articles found!</h2>
            )}

            {!isLoading &&
              articles.map((article) => (
                <article key={article.objectID}>
                  <h3>{article.title}</h3>

                  <footer>
                    <ul>
                      <li>
                        <CalendarIcon className="w-4 h-4 mr-px" />
                        {formatDate(article.created_at)}
                      </li>
                      <li>
                        <UserCircleIcon className="w-4 h-4 mr-1" />
                        {article.author}
                      </li>
                    </ul>

                    <a
                      href={article.url}
                      target="_blank"
                      className="w-full btn sm:w-36"
                    >
                      Read More
                    </a>
                  </footer>
                </article>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
