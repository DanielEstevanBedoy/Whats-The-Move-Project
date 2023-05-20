import React from 'react'

// Represent every individual item in our grid
export default function Day({day}) {
    console.log(day)
   return(
        <div>
            {day.format()}
        </div>
   )
}