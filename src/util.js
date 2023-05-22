// some shared functions
import dayjs from 'dayjs'

// returns array that contains the days of the week for each day of the month 
export function getMonth(month = dayjs().month()) { // default = current 
    const year = dayjs().year()
    // the day of the week of the first day of the month 

    // firstDay = Thurs (4) 
    const firstDay = dayjs(new Date(year, month, 1)).day()  

    // -4 
    let currentDay = -firstDay

    // 5 x 7 array  
    const daysMatrix = new Array(5).fill([]).map(() => {
        return new Array(7).fill(null).map(() => {
            // -3 
            currentDay++ 
            // 2023, June, -3 
            return dayjs(new Date(year, month, currentDay))
        })
    })
    return daysMatrix;
}