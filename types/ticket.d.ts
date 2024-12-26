//? Type Dependencies

import type { ObjectId } from "mongodb"



//? Type Definitions

export { }

declare global {

    interface Ticket {
        owner?: string
        designation?: string
        state?: 'open' | 'closed' | 'pending'
        priority?: 'low' | 'high'
        created?: number
        notify?: number
        members?: string[]
    }

    interface TicketOld {
        _id: ObjectId

        state: 'open' | 'closed' | 'archived'
        
        owner: string
        channel: string
        controller: string

        number: number
        priority: ('low' | 'medium' | 'high') | null
        ntk: string | null
        conclusion: string | null

        details: {
            title?: string
            service?: string
            description?: string
        }

        log: {
            users: {
                id: string
                username: string
                discriminator: string
                avatar: string | null
            }[]

            messages: {
                id: string
                content: string
                author: string
                timestamp: Date
            }[]
        }

        created: Date
        closed: Date | null
    }

}