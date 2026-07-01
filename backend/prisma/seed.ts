import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const school = await prisma.school.create({
    data: { name: 'Greenwood High School', address: '123 Main St', email: 'admin@greenwood.edu' },
  });

  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.create({
    data: {
      schoolId: school.id,
      email: 'admin@greenwood.edu',
      passwordHash,
      role: 'SCHOOL_ADMIN',
    },
  });

  const year = await prisma.academicYear.create({
    data: {
      schoolId: school.id,
      name: '2026-2027',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2027-04-30'),
      isCurrent: true,
    },
  });

  const grade5 = await prisma.class.create({
    data: { academicYearId: year.id, name: 'Grade 5', numericLevel: 5 },
  });

  const sectionA = await prisma.section.create({
    data: { classId: grade5.id, name: 'A', capacity: 40 },
  });

  const math = await prisma.subject.create({ data: { schoolId: school.id, name: 'Mathematics', code: 'MATH5' } });
  await prisma.subjectClass.create({ data: { classId: grade5.id, subjectId: math.id } });

  const student = await prisma.student.create({
    data: {
      admissionNo: 'ADM-2026-0001',
      firstName: 'Aarav',
      lastName: 'Sharma',
      dob: new Date('2015-04-12'),
      gender: 'MALE',
      sectionId: sectionA.id,
    },
  });

  await prisma.guardian.create({
    data: {
      firstName: 'Rohit',
      lastName: 'Sharma',
      relation: 'Father',
      phone: '9999999999',
      students: { create: { studentId: student.id, isPrimary: true } },
    },
  });

  const feeCategory = await prisma.feeCategory.create({
    data: { schoolId: school.id, name: 'Tuition' },
  });

  const feeStructure = await prisma.feeStructure.create({
    data: { academicYearId: year.id, classId: grade5.id, name: 'Grade 5 Annual Fee Plan' },
  });

  await prisma.feeStructureItem.create({
    data: { feeStructureId: feeStructure.id, feeCategoryId: feeCategory.id, amount: 50000, frequency: 'ANNUAL' },
  });

  await prisma.feeInvoice.create({
    data: {
      studentId: student.id,
      feeStructureId: feeStructure.id,
      totalAmount: 50000,
      dueDate: new Date('2026-08-01'),
    },
  });

  console.log('Seed complete. Login with admin@greenwood.edu / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
