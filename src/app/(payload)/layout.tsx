/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD, THEN ADJUSTED TO MATCH
   THE ACTUALLY-INSTALLED @payloadcms/next@3.90.2 API — its current
   templates (on GitHub's main branch) import a `generatePayloadViewport`
   helper that doesn't exist in this published version; this version
   exports a plain static `metadata` object instead (confirmed by reading
   node_modules/@payloadcms/next/dist/layouts/Root/index.d.ts directly,
   not assumed from the docs/template). */
import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, metadata, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'

export { metadata }

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
