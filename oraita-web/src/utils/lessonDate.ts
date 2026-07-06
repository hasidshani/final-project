// MongoDB date is a full ISO string; combine with time before comparing so
// same-day lessons are only hidden once their start time has actually passed.
export function isLessonUpcoming(lesson: { date: string; time: string }): boolean {
    const dateStr = lesson.date.split('T')[0];
    return new Date(`${dateStr}T${lesson.time}`) > new Date();
}
