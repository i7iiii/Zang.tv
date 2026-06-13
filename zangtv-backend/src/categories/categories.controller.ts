import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CategoriesService } from './categories.service'
@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private svc: CategoriesService) {}
  @Get() findAll() { return this.svc.findAll() }
}
