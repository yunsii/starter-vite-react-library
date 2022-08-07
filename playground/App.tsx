import React from 'react'

import { Button } from '../src'

export default function App() {
  return (
    <div>
      <Button extra={<span style={{ marginLeft: 4 }}>(Extra)</span>}>
        Test
      </Button>
    </div>
  )
}
