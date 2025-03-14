import { Controller, Get, Param, Delete, Post, Body, Put } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { Attendance } from './attendance.entity';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  findAll(): Promise<Attendance[]> {
    return this.attendanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Attendance> {
    return this.attendanceService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.attendanceService.remove(+id);
  }

  @Post()
  create(@Body() attendance: Attendance): Promise<Attendance> {
    return this.attendanceService.create(attendance);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() attendance: Attendance): Promise<void> {
    return this.attendanceService.update(+id, attendance);
  }
}
