import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateThreadValidator from 'App/Validators/CreateThreadValidator'
import UpdateThreadValidator from 'App/Validators/UpdateThreadValidator'
import Thread from 'App/Models/Thread'
import SortValidator from 'App/Validators/SortValidator'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'

export default class ThreadsController {
    public async index({ request, response }: HttpContextContract) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 25)
        const userId = request.input('user_id')
        const categoryId = request.input('category_id')

        const validatedData = await request.validate(SortValidator)

        const sortBy = validatedData.sort_by || 'id'
        const order = validatedData.order || 'asc'

        const threads = await Thread.query()
            .if(userId, (query) => {
                query.where('user_id', userId)
            })
            .if(categoryId, (query) => {
                query.where('user_id', categoryId)
            })
            .orderBy(sortBy, order)
            .preload('user')
            .preload('category')
            .preload('replies')
            .paginate(page, perPage)

        return response.ok({data: threads})
    }
    public async store({ request, auth, response }: HttpContextContract) {
        const validatedData = await request.validate(CreateThreadValidator)

        const thread = await auth.user?.related('threads').create(validatedData)

        await thread?.preload('user')
        await thread?.preload('category')
        await thread?.preload('replies')

        return response.created({data: thread})
    }
    public async show({ params, response }: HttpContextContract) {
        const thread = await Thread.query()
            .where('id', params.id)
            .preload('user')
            .preload('category')
            .preload('replies')
            .firstOrFail()

            return response.ok({data: thread})
    }
    public async update({ request, params, auth, response }: HttpContextContract) {
        const thread = await Thread.firstOrFail(params.id)

        const validatedData = await request.validate(UpdateThreadValidator)

        if(auth.user?.id !== thread.userId){
            throw new UnauthorizedException('You can only edit your own thread')
        }

        thread.merge(validatedData)

        await thread.save()

        await thread?.preload('user')
        await thread?.preload('category')
        await thread?.preload('replies')

        return response.ok({data: thread})
    }
    public async destroy({ params, auth, response }: HttpContextContract) {
        const thread = await Thread.findOrFail(params.id)

        if(auth.user?.id !== thread.userId){
            throw new UnauthorizedException('You can only delete your own thread')
        }

        await thread.delete

        return response.noContent()
    }

}
