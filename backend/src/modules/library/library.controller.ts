import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { LibraryService } from './library.service';

@ApiTags('library')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('library')
export class LibraryController {
  constructor(private libraryService: LibraryService) {}

  @Post('books')
  @Roles(UserRole.LIBRARIAN, UserRole.SCHOOL_ADMIN)
  addBook(@Req() req: any, @Body() body: { title: string; author?: string; isbn?: string; totalCopies: number }) {
    return this.libraryService.addBook(req.user.schoolId, body);
  }

  @Get('books')
  @Roles(UserRole.LIBRARIAN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  listBooks(@Req() req: any) {
    return this.libraryService.listBooks(req.user.schoolId);
  }

  @Post('loans')
  @Roles(UserRole.LIBRARIAN, UserRole.SCHOOL_ADMIN)
  issueBook(@Body() body: { bookId: string; studentId: string; dueDate: string }) {
    return this.libraryService.issueBook(body.bookId, body.studentId, body.dueDate);
  }

  @Post('loans/:id/return')
  @Roles(UserRole.LIBRARIAN, UserRole.SCHOOL_ADMIN)
  returnBook(@Param('id') id: string) {
    return this.libraryService.returnBook(id);
  }

  @Get('loans/student/:studentId')
  @Roles(UserRole.LIBRARIAN, UserRole.SCHOOL_ADMIN, UserRole.STUDENT, UserRole.PARENT)
  getStudentLoans(@Param('studentId') studentId: string) {
    return this.libraryService.getStudentLoans(studentId);
  }
}
