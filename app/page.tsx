'use client';
import SwaggerUI  from 'swagger-ui'
import 'swagger-ui/dist/swagger-ui.css';
import { useEffect, useRef, useState } from 'react';
import urls from '../public/urls.json'

export default function Home() {

  return (
    <>
      <a href='https://github.com/Amaizzzzz/azure-rest-api-swagger'>GitHub</a>
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
    <button onClick={() => {
      if (swaggerObject != null) {
        swaggerObject.specActions.updateUrl("https://raw.githubusercontent.com/Azure/azure-rest-api-specs/main/specification/apimanagement/resource-manager/Microsoft.ApiManagement/stable/2022-08-01/apimapis.json")
        swaggerObject.specActions.download("https://raw.githubusercontent.com/Azure/azure-rest-api-specs/main/specification/apimanagement/resource-manager/Microsoft.ApiManagement/stable/2022-08-01/apimapis.json")
      }
    }}>API 1</button>
    <button onClick={() => {
      if (swaggerObject != null) {
        swaggerObject.specActions.updateUrl("https://raw.githubusercontent.com/Azure/azure-rest-api-specs/main/specification/apimanagement/resource-manager/Microsoft.ApiManagement/stable/2022-08-01/apimdeployment.json")
        swaggerObject.specActions.download("https://raw.githubusercontent.com/Azure/azure-rest-api-specs/main/specification/apimanagement/resource-manager/Microsoft.ApiManagement/stable/2022-08-01/apimdeployment.json")
      }
    }}>API 2</button>
    <div ref={ref} />
  </>);
}
