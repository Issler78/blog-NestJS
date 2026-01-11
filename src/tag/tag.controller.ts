import { Controller, Get } from '@nestjs/common';
import { TagService } from '@/tag/tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async getAll() {
    const allTags = await this.tagService.getAll();
    const tags: string[] = allTags.map((tag) => tag.name); // get only names and return an array

    return { tags }; // like { tags: tags }
  }
}
