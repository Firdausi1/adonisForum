import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ReplyValidator {
  constructor (protected ctx: HttpContextContract) {
  }
  public schema = schema.create({
	content: schema.string()
  })
  public messages = {}
}
