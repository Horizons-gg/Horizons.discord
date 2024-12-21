import support from './support'
import verify from './verify'



export default {
    commands: [
        support.data,
        verify.data,
    ],

    lib: {
        support,
        verify,
    }
}