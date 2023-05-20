import React from 'react'
import Day from './Day'

/* 
takes one prop, months, which is a two-dimensional array 
representing  a grid of days (of the week)
*/  
export default function Month({month}) {
    return(
        <div className="flex-1 grid grid-cols-7 grid-rows-5">
            {month.map((row, i) => (
                // maps over each row, and each day
                <React.Fragment key = {i}>
                    {row.map((day, id) => (
                        <Day day={day} key={id} />
                    ))}
                </React.Fragment>
            ))}
        </div>
    )
}