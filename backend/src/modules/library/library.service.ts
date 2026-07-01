import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class LibraryService {
  constructor(private prisma: PrismaService) {}

  addBook(schoolId: string, data: { title: string; author?: string; isbn?: string; totalCopies: number }) {
    return this.prisma.book.create({
      data: { ...data, schoolId, availableCopies: data.totalCopies },
    });
  }

  listBooks(schoolId: string) {
    return this.prisma.book.findMany({ where: { schoolId } });
  }

  async issueBook(bookId: string, studentId: string, dueDate: string) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Book not found');
    if (book.availableCopies < 1) throw new BadRequestException('No copies available');

    return this.prisma.$transaction(async (tx) => {
      await tx.book.update({ where: { id: bookId }, data: { availableCopies: { decrement: 1 } } });
      return tx.libraryLoan.create({
        data: { bookId, studentId, dueDate: new Date(dueDate) },
      });
    });
  }

  async returnBook(loanId: string) {
    const loan = await this.prisma.libraryLoan.findUnique({ where: { id: loanId } });
    if (!loan) throw new NotFoundException('Loan not found');

    return this.prisma.$transaction(async (tx) => {
      await tx.book.update({ where: { id: loan.bookId }, data: { availableCopies: { increment: 1 } } });
      return tx.libraryLoan.update({
        where: { id: loanId },
        data: { status: 'RETURNED', returnedAt: new Date() },
      });
    });
  }

  getStudentLoans(studentId: string) {
    return this.prisma.libraryLoan.findMany({ where: { studentId }, include: { book: true } });
  }
}
