'use client';
import SwaggerUI from 'swagger-ui'
import 'swagger-ui/dist/swagger-ui.css';
import { useEffect, useRef, useState } from 'react';
import urls from '../public/urls.json'
import Select from 'react-select'

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
        url: "https://raw.githubusercontent.com/Azure/azure-rest-api-specs/main/specification/apimanagement/resource-manager/Microsoft.ApiManagement/stable/2022-08-01/apimapis.json",
        // urls: urls,
      })
      setSwaggerObject(swaggerObject);
    }
  }, [setSwaggerObject, ref]);

  return (<>
    <a href='https://github.com/Amaizzzzz/azure-rest-api-swagger'>GitHub</a>
    {(swaggerObject != null) ? (<>
      <Select
        options={urls}
        getOptionLabel={(option) => option.name}
        onChange={(e) => {
          swaggerObject.specActions.updateUrl(e.url)
          swaggerObject.specActions.download(e.url)
        }} />
    </>) : (<></>)}
    <div ref={ref} />
  </>);
}
