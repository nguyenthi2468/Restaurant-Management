import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FloorService } from './floor.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';

@ApiTags('floors')
@ApiBearerAuth()
@Controller('floors')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo tầng mới',
    description: 'Tạo một tầng mới với tên duy nhất',
  })
  @ApiCreatedResponse({
    description: 'Tầng đã được tạo thành công',
    type: CreateFloorDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Tên tầng đã tồn tại' })
  create(@Body() createFloorDto: CreateFloorDto) {
    return this.floorService.create(createFloorDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách tất cả tầng',
    description: 'Lấy danh sách tất cả các tầng kèm số lượng bàn',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách tầng',
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.floorService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin tầng theo ID',
    description: 'Lấy thông tin chi tiết của một tầng cụ thể kèm danh sách bàn',
  })
  @ApiResponse({ status: 200, description: 'Chi tiết tầng' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tầng' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.floorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật thông tin tầng',
    description: 'Cập nhật tên của tầng',
  })
  @ApiResponse({ status: 200, description: 'Tầng đã được cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tầng' })
  @ApiResponse({ status: 409, description: 'Tên tầng đã tồn tại' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateFloorDto: UpdateFloorDto) {
    return this.floorService.update(id, updateFloorDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa tầng',
    description: 'Xóa một tầng (chỉ khi không còn bàn nào)',
  })
  @ApiResponse({ status: 200, description: 'Tầng đã được xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tầng' })
  @ApiResponse({
    status: 400,
    description: 'Không thể xóa tầng vì còn bàn đang sử dụng',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.floorService.remove(id);
  }
}
