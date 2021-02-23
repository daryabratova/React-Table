import "./App.scss";

import { Table } from "../../components/Table";

import { cn } from "../../helpers/classname";

import data from "../../data/table-data.json";

const appClassName = cn("app");

export const App = () => {
  return (
    <div className={appClassName("layout")}>
      <Table data={data} />
    </div>
  );
};
