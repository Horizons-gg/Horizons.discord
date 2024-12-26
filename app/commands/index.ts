import support from './support'
import ticket from './ticket'
import verify from './verify'



export default {
    commands: [
        support.data,
        ticket.data,
        verify.data,
    ],

    lib: {
        support,
        ticket,
        verify,
    }
}