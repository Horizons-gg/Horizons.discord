import support from './support/index.ts'
import ticket from './ticket/index.ts'
import verify from './verify/index.ts'

import joke from './joke/index.ts'



const commands = [
    support.data,
    ticket.data,
    verify.data,

    joke.data,
]

const response: { [key: string]: any } = {
    support,
    ticket,
    verify,

    joke,
}


export { commands, response }