"use client";
import SwaggerUI from "swagger-ui";
import "swagger-ui/dist/swagger-ui.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { apiOptions, IApiOption, IApiVersionOption } from "./transform-data";
import Select, { createFilter } from "react-select";
import { FilterOptionOption } from "react-select/dist/declarations/src/filters";
import { findApi, findApiVersion } from "./utils";
import css from "./page.module.css";
import "./globals.css";

export default function Home({ searchParams }) {
  const api = searchParams.api && decodeURIComponent(searchParams.api);
  const version =
    searchParams.version && decodeURIComponent(searchParams.version);

  return (
    <>
      <header className={css.header}>
        <div className={`${css.wrapper} ${css.flex}`} >
          <h1>Azure REST API Swagger</h1>
          <a
            href="https://github.com/Amaizzzzz/azure-rest-api-swagger"
            target="_blank"
          >
            GitHub
          </a>
        </div>
      </header>
      <SwaggerComponent api={api} version={version} />
    </>
  );
}

function makeAcronym(s: string) {
  return s.replace(/[^A-Z]/g, "");
}

function SwaggerComponent(props: { api?: string; version?: string }) {
  const { api, version } = props;
  const [swaggerObject, setSwaggerObject] = useState(null);
  const ref = useRef(null);

  const [selectedApi, setSelectedApi] = useState<IApiOption>(findApi(api));

  const [selectedVersion, setSelectedVersion] = useState<IApiVersionOption>(
    findApiVersion(selectedApi, version)
  );

  const swaggerUrl = selectedVersion?.value;

  const handleSelectApi = (e: IApiOption) => {
    if (e !== selectedApi) {
      setSelectedApi(e);
      setSelectedVersion(e.value.versions?.[0]);
    }
  };

  const handleSelectVersion = (e: IApiVersionOption) => {
    setSelectedVersion(e);
  };

  useEffect(() => {
    if (ref.current != null) {
      const swaggerObject = SwaggerUI({
        domNode: ref.current,
      });
      setSwaggerObject(swaggerObject);
    }
  }, []);

  useEffect(() => {
    // update url query param
    const url = new URL(window.location.href);
    if (selectedApi) {
      url.searchParams.set("api", encodeURIComponent(selectedApi.label));
    }
    if (selectedVersion) {
      url.searchParams.set(
        "version",
        encodeURIComponent(selectedVersion.label)
      );
    }
    window.history.pushState({}, "", url.toString());
  }, [selectedApi, selectedVersion]);

  useEffect(() => {
    if (swaggerObject != null && swaggerUrl != null) {
      swaggerObject.specActions.updateUrl(swaggerUrl);
      swaggerObject.specActions.download(swaggerUrl);
    }
  }, [swaggerObject, swaggerUrl]);

  // TODO: refine filter to support acronyms
  const filterOption = useMemo(
    () =>
      createFilter({
        ignoreCase: true,
        ignoreAccents: true,
        trim: true,
        matchFrom: "any" as const,
        stringify: (option: FilterOptionOption<IApiOption>) =>
          `${option.data.label} ${option.data.value.path} ${makeAcronym(
            option.data.label
          )}`,
      }),
    []
  );

  // TODO: better styling
  return (
    <>
      <div className={css.wrapper}>
        <Select<IApiOption>
          className={css.select}
          value={selectedApi}
          options={apiOptions}
          onChange={handleSelectApi}
          placeholder="Select a service..."
          filterOption={filterOption}
        />
        {selectedApi?.value?.versions?.length && (
          <Select<IApiVersionOption>
            className={css.select}
            value={selectedVersion}
            // TODO: add hint for what to type
            options={selectedApi?.value?.versions}
            onChange={handleSelectVersion}
            placeholder="Select an API version..."
          />
        )}
      </div>
      <div ref={ref} />
    </>
  );
}
