import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ReplyValidator from 'App/Validators/ReplyValidator'
import Thread from 'App/Models/Thread'

export default class RepliesController {
    public async store({ request, params , auth, response}: HttpContextContract){
        const {content} = await request.validate(ReplyValidator)

        const thread = await Thread.findOrFail(params.thread_id)

        const reply = await thread.related('replies').create({
            userId: auth.user?.id,
            content,
        })

        await reply.preload('user')
        await reply.preload('thread')

        
        return response.created({data: reply})
    }
}
