'use client'
import {SwaggerUIBundle, SwaggerUIStandalonePreset} from 'swagger-ui-dist'
import 'swagger-ui-dist/swagger-ui.css';
import { useEffect } from 'react';
import urls from '../public/urls.json'
export default function Home() {

  return (
    <>
    <a href='https://github.com/Amaizzzzz/azure-rest-api-swagger'>GitHub</a>
    <div id="swagger"></div>
    <SwaggerComponent />
    </>
  )
}

function SwaggerComponent() {
  useEffect(() => {
    SwaggerUIBundle({
      dom_id: '#swagger',
      urls: urls,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      layout: "StandaloneLayout"
    })
  },[])
  return (<></>)
}