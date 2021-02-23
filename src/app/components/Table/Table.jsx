import React, { useState, useEffect, useMemo } from "react";

import { cn } from "../../helpers/classname";

import "./Table.scss";

export const Table = (props) => {
  const tableClassName = cn("table");
  const paginationClassName = cn("pagination");

  const { data } = props;
  const { header, order } = data;

  const pageSize = 50;

  const [currentPage, setCurrentPage] = useState(0);
  const [sorting, setSorting] = useState(null);
  const [filtering, setFiltering] = useState(
    Object.fromEntries(order.map((fieldId) => [fieldId, ""]))
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [sorting, filtering])

  const indexedRecords = useMemo(() => {
    const { records } = data;

    return records.map((record, id) => {
      return { ...record, id };
    });
  }, [data.records]);

  let records = indexedRecords.slice();

  if (sorting !== null) {
    records.sort((a, b) => {
      if (sorting.order === "asc") {
        if (a[sorting.fieldId] < b[sorting.fieldId]) {
          return -1;
        }
        if (a[sorting.fieldId] > b[sorting.fieldId]) {
          return 1;
        }
      }

      if (a[sorting.fieldId] > b[sorting.fieldId]) {
        return -1;
      }
      if (a[sorting.fieldId] < b[sorting.fieldId]) {
        return 1;
      }

      return 0;
    });
  }

  if (Object.values(filtering).some((value) => Boolean(value))) {
    records = records.filter((record) => {
      return Object.keys(filtering).every((fieldId) =>
        String(record[fieldId]).toLowerCase().includes(filtering[fieldId].toLowerCase())
      );
    });
  }

  const renderHeader = () => {
    return (
      <thead className={tableClassName("head")}>
        <tr className={tableClassName("row")}>
          {order.map((fieldId) => {
            const handleSortClick = () => {
              setSorting((sorting) => {
                if (sorting === null || sorting.fieldId !== fieldId) {
                  return {
                    fieldId,
                    order: "asc",
                  };
                }

                if (sorting !== null && sorting.order === "asc") {
                  return {
                    fieldId,
                    order: "desc",
                  };
                }

                if (sorting !== null && sorting.order === "desc") {
                  return null;
                }
              });
            };

            return (
              <th className={tableClassName("header")} key={fieldId}>
                {header[fieldId]}
                <button
                  className={tableClassName("sort")}
                  onClick={handleSortClick}
                ></button>
              </th>
            );
          })}
        </tr>
        <tr className={tableClassName("row")}>
          {order.map((fieldId) => {
            const handleFilterChange = (event) => {
              const { value } = event.target;
              setFiltering((filtering) => {
                return {
                  ...filtering,
                  [fieldId]: value,
                };
              });
            };

            return (
              <td className={tableClassName("data")}>
                <input
                  className={tableClassName("input")}
                  value={filtering[fieldId]}
                  onChange={handleFilterChange}
                  placeholder={`Filter ${header[fieldId].toLowerCase()}...`}
                  key={fieldId}
                ></input>
              </td>
            );
          })}
        </tr>
      </thead>
    );
  };

  const renderBody = () => {
    const recordsOnPage = records.slice(
      currentPage * pageSize,
      pageSize * (currentPage + 1)
    );

    return (
      <tbody className={tableClassName("body")}>
        {recordsOnPage.map((record) => {
          const { id } = record;

          return (
            <tr className={tableClassName("row")} key={id}>
              {order.map((fieldId) => {
                return (
                  <td className={tableClassName("data")} key={fieldId}>
                    {record[fieldId]}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    );
  };

  const renderPagination = () => {
    const pagesTotal = Math.ceil(records.length / pageSize);

    const pages = Array(pagesTotal)
      .fill(null)
      .map((_, i) => i);

    return (
      <div className={paginationClassName("layout")}>
        {pages.map((page) => {
          const handleClick = () => {
            setCurrentPage(page);
          };

          return (
            <button
              className={
                currentPage === page
                  ? paginationClassName("button", { active: true })
                  : paginationClassName("button")
              }
              key={page}
              onClick={handleClick}
            >
              {page + 1}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <table className={tableClassName("layout")}>
        {renderHeader()}
        {renderBody()}
      </table>
      {renderPagination()}
    </div>
  );
};
