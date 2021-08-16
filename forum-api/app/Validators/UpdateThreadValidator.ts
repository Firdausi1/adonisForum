import { schema , rules} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateThreadValidator {
  constructor (protected ctx: HttpContextContract) {
  }
  public schema = schema.create({
	title: schema.string.optional({}, [
		rules.maxLength(255)
	]),
	content: schema.string.optional(),
	category_id: schema.number.optional([
		rules.exists({table:'categories', column:'id'})
	])
  })
  public messages = {}
}
