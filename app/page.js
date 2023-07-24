'use client'
import {SwaggerUIBundle, SwaggerUIStandalonePreset} from 'swagger-ui-dist'
import 'swagger-ui-dist/swagger-ui.css';
import { useEffect } from 'react';

export default function Home() {

  return (
    <>
    <div id="swagger"></div>
    <SwaggerComponent />
    </>
  )
}

function SwaggerComponent() {
  useEffect(() => {
    SwaggerUIBundle({
      dom_id: '#swagger',
      url: 'https://raw.githubusercontent.com/Azure/azure-rest-api-specs/main/specification/compute/resource-manager/Microsoft.Compute/ComputeRP/stable/2023-03-01/virtualMachine.json',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      layout: "StandaloneLayout"
    })
  },[])
  return (<></>)
}