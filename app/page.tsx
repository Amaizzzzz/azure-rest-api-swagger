'use client';
import SwaggerUI from 'swagger-ui'
import 'swagger-ui/dist/swagger-ui.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import urls from '../public/urls.json'
import Select, { createFilter } from 'react-select'
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';

// infer the type of urls
type Urls = typeof urls;

// infer the type of elements of urls
type Url = Urls[number];

export default function Home() {

  return (
    <>
      <SwaggerComponent />
    </>
  )
}

function SwaggerComponent() {
  const [swaggerObject, setSwaggerObject] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current != null) {
      const swaggerObject = SwaggerUI({
        domNode: ref.current,
      })
      setSwaggerObject(swaggerObject);
    }
  }, [setSwaggerObject, ref]);

  // TODO: refine filter to support acronyms
  const filterOption = useMemo(() => createFilter({
    ignoreCase: true,
    ignoreAccents: true,
    trim: true,
    matchFrom: "any" as const,
    stringify: (option: FilterOptionOption<Url>) => `${option.data.name} ${option.data.url}`,
  }), []);

  // TODO: better styling
  return (<>
    <a href='https://github.com/Amaizzzzz/azure-rest-api-swagger'>GitHub</a>
    {(swaggerObject != null) ? (<>
      <Select
        // TODO: add hint for what to type
        options={urls}
        getOptionLabel={(option) => option.name}
        onChange={(e) => {
          swaggerObject.specActions.updateUrl(e.url)
          swaggerObject.specActions.download(e.url)
        }
        }
        filterOption={filterOption}
      />
    </>) : (<></>)}
    <div ref={ref} />
  </>);
}
