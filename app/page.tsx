"use client";
import SwaggerUI from "swagger-ui";
import "swagger-ui/dist/swagger-ui.css";
import { useEffect, useMemo, useRef, useState } from "react";
import urls from "../public/urls.json";
import Select, { createFilter } from "react-select";
import { FilterOptionOption } from "react-select/dist/declarations/src/filters";

type UrlGroups = typeof urls;

type UrlGroup = UrlGroups[number];

type UrlOptions = UrlGroup["api_version_options"];

type UrlOption = UrlGroup["api_version_options"][number];

export default function Home() {
  return (
    <>
      <SwaggerComponent />
    </>
  );
}

function SwaggerComponent() {
  const [swaggerObject, setSwaggerObject] = useState(null);
  const ref = useRef(null);

  const [applicableAPIVersionOptions, setApplicableAPIVersionOptions] =
    useState<UrlOptions>([]);

  const [defaultAPIVersionOption, setDefaultAPIVersionOption] =
    useState<UrlOption | null>(null);

  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  useEffect(() => {
    if (ref.current != null) {
      const swaggerObject = SwaggerUI({
        domNode: ref.current,
      });
      setSwaggerObject(swaggerObject);
    }
  }, [setSwaggerObject, ref]);

  useEffect(() => {
    if (applicableAPIVersionOptions.length > 0) {
      setDefaultAPIVersionOption(applicableAPIVersionOptions[0]);
      setCurrentUrl(applicableAPIVersionOptions[0].url);
    }
  }, [applicableAPIVersionOptions]);

  useEffect(() => {
    if (swaggerObject != null && currentUrl != null) {
      swaggerObject.specActions.updateUrl(currentUrl);
      swaggerObject.specActions.download(currentUrl);
    }
  }, [swaggerObject, currentUrl]);

  // TODO: refine filter to support acronyms
  const filterOption = useMemo(
    () =>
      createFilter({
        ignoreCase: true,
        ignoreAccents: true,
        trim: true,
        matchFrom: "any" as const,
        stringify: (option: FilterOptionOption<UrlGroup>) =>
          `${option.data.label} ${option.data.path_without_api_version}`,
      }),
    []
  );

  // TODO: better styling
  return (
    <>
      <a href="https://github.com/Amaizzzzz/azure-rest-api-swagger">GitHub</a>
      {swaggerObject != null ? (
        <>
          <Select<UrlGroup>
            options={urls}
            onChange={(e) => {
              setApplicableAPIVersionOptions(e.api_version_options);
            }}
            placeholder="Select a service..."
            filterOption={filterOption}
          />
          {applicableAPIVersionOptions.length != 0 ? (
            <Select<UrlOption>
              // TODO: add hint for what to type
              options={applicableAPIVersionOptions}
              defaultValue={defaultAPIVersionOption}
              // force rerender when the list of applicable API version changes, so that the default API version is selected
              key={defaultAPIVersionOption?.url}
              getOptionLabel={(x) => `${x.api_version}`}
              onChange={(e) => {
                if (e != null) {
                  setCurrentUrl(e.url);
                }
              }}
              placeholder="Select an API version..."
            />
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
      <div ref={ref} />
    </>
  );
}
