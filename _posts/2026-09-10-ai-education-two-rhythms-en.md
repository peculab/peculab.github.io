---
title: "The Same Course, Different Echoes: What I Saw About AI Education Between Taiwanese High Schools and a U.S. Summer Camp"
subtitle: "What one elective course, two years of records, and student projects revealed about different rhythms of AI learning in Taiwan and the United States."
date: 2026-09-11
lang: en
category: field-notes
translation_key: ai-education-two-rhythms
series: Taiwan–Seattle Education Field Notes
excerpt: "Across roughly two thousand student participations and nearly two hundred senior high and vocational schools, a non-mandatory AI elective showed me the complicated relationship between participation, exam pressure, family choice, and course design."
---

I am writing this after handing my course, “Python AI Beginner’s Practical Course: From Real-Life Issues to Hands-On Applications,” to a younger colleague to continue.

I used to think that the end of a course meant organizing the materials, counting submissions, and finishing the closing report. But as I spread the records out in front of me, what I began to miss was not any particular unit. It was the students who appeared briefly in the course and then returned to their own lives. What did they actually carry away from a freely chosen elective? 

Over these two years, roughly two thousand high-school and vocational-school student participations accumulated across the course, reaching nearly two hundred schools. This is not a number I can use to claim that “all students learned AI.” It is more like a map. It shows how many people came to the doorway, and why the number of people willing to walk a little farther inside is always smaller.

## I did not simply hand students tools; I tried to build a path

The course is called “Python AI Beginner’s Practical Course: From Real-Life Issues to Hands-On Applications.” To me, the most important part of that title is not Python, and not AI by itself. It is the path from a real-life issue to a practical application.

I did not want students to remember only a piece of syntax, or to paste a question into an AI tool and copy whatever code looked runnable. Instead, I designed a sequence of small attempts. We began with variables, input and output, conditional logic, and defensive input handling. We then moved into data structures, CSV and JSON, visualization, linear regression, rule-based chatbots, prompts, image recognition, text processing, and web scraping. I tried to place each technique inside a situation students could imagine: calculating grades, analyzing a café’s sales, searching hotel data by budget, reading news headlines, and examining movie reviews and sentiment.

In 114-1, five practical assignments formed the spine of the course: handling invalid input, analyzing consumption data, querying hotel data in JSON, tokenizing historical text, and extracting text from HTML. In 114-2, I shifted to ten units with a regular rhythm: about twenty minutes of demonstration followed by time for students to practice and revise. YouTube livestreams and recordings worked alongside Google Colab. GitHub held the materials and projects, while teaching assistants and local teachers provided additional points of contact.

The idea was to make “I don’t know how” into a series of smaller questions: first get the program to run, then ask why it ran that way; first notice the error, then practice finding something to change. AI could help explain, debug, and generate ideas, but it could not decide what the problem was, whether the result made sense, or whether the project was actually useful to someone.

## What two years left behind was not a perfect completion rate

I do not want to compress both semesters into one polished annual percentage. The rosters, assessment systems, and recording methods were different. The more honest approach is to place the two semesters side by side.

| Semester | What can be confirmed | How I read it |
| --- | --- | --- |
| 114-1 | The cooperating-teacher file listed 25 schools. The grade file contained 4,429 grading records, including repeat submissions, so it cannot be treated as a student count. The final sharing area had 27 posts, 23 of which included both a Colab link and a video. | This was a learning process built from assignments, feedback, and final expression, but there was no formal roster that could support a total-enrollment calculation. |
| 114-2 | The submission sheet listed 29 school names and 554 students. 509 students submitted at least one unit (91.9%); the average was 6.01 unit records and the median was 6. 201 students had records for at least eight units (36.3%), and 99 had records for all ten (17.9%). | Most students on the roster encountered the course, but only a minority sustained participation throughout. That is exactly what makes a free elective worth understanding. |

Across the ten 114-2 units, there were 3,332 recorded student–unit submissions, about 60.1% of the 554 students multiplied by ten units. From March through April, unit submissions ranged from 384 to 460. In May, they fell to between 183 and 231. I cannot directly interpret that decline as lost interest, nor can I attribute it to teaching. Exams, school activities, whole-class absences, roster differences, make-up schedules, and unit difficulty may all have shaped the result.

The final sharing areas show a similar difference. Issue #111 in 114-1 contained 27 student posts, and 23 included both code and an explanatory video. Issue #112 in 114-2 contained 58 student posts after one teaching-assistant example was excluded, and 54 included both a Colab link and a video. At the threshold of “willing to organize and publish a project,” the two-semester share of posts with both links rose from 85.2% to 93.1%. But post counts are not unique-student counts or full-project completion rates. Some posts documented unit outcomes, some were collaborative projects, and some linked back to the original course materials.

So the most useful question these numbers answer is not “Did the course make everyone successful?” It is: “How far did students reach, in different ways?”

## Freedom does not mean sustained participation: an elective must still survive exam pressure

This was a cross-school distance elective, not a compulsory subject. In theory, students could use it to explore an interest. In practice, the elective still had to compete with Chinese, English, mathematics, professional subjects, and preparation for the next stage of education.

Sometimes a school canceled the class for an exam week, a mock exam, or another campus activity. Sometimes a student logged in simply to catch their breath between a full day of required subjects. Failing to submit a task that required a little more integration, debugging, or explanation did not necessarily mean the student did not care. It might mean that something else was more urgent that week.

For that reason, I do not want to describe the 99 students with records for all ten units as “the students who truly worked hard,” nor describe those without a complete record as “unmotivated.” In a free elective, participation has different depths. Some students complete the basic practice. Some watch a recording and make their own revision. Some return only when they have room in their schedule. Some do not discover until the final weeks that they want to try again.

When a task requires integration, debugging, or an explanation, the number of students willing to submit usually becomes smaller. That can be discouraging for a teacher, but it is also an important signal. If policy hopes students will become self-directed learners, it cannot offer only the word “freedom.” It also needs return points, a small enough first step, clear examples, and a recovery path that does not define a student by one absence.

## In the student projects, I saw beginnings rather than finished products

The work that moved me most was rarely the most sophisticated program. It was the moment a student began asking the next question.

In 114-1, one student noticed after a hotel-price analysis that the original dataset had too few fields. To make the analysis more meaningful, the student suggested adding features and improving data quality. That was a shift from asking “Can the program run?” to asking “Is this result strong enough to support my conclusion?”

Another student, while reading an AI-generated research summary, asked for a fixed JSON structure with fields such as research purpose, method, and contribution. This does not prove that the student could independently build a complete data pipeline. It does show an emerging understanding that a good prompt needs to include a use case, and that a useful output must be usable by the next step.

In 114-2, two students collaborated on a Pygame project. They discovered that Colab could not conveniently open a game window, so they organized a GitHub folder and a download-and-run path, explaining the execution constraint. I did not run and verify every feature, so I would not call the project “fully tested.” But the students took an important step: instead of hiding an environment problem, they described it clearly enough for someone else to try.

In their reflections, some students admitted that programming felt more unfamiliar than expected and that error messages had stopped them. After debugging and revising on their own, they remembered the meaning of the code more clearly. Some said that Colab lowered the equipment barrier and that recordings let them return to confusing parts. Others realized that the more precisely they asked an AI tool a question, the more useful its help became. These are not standardized answers. They are signs that learning was beginning to become their own.

One student explicitly labeled which parts of a reflection had been organized with NotebookLM and which parts described their own code and explanations. That does not prove accuracy or complete independence. It does, however, show a kind of transparency worth encouraging: once AI enters the process, students begin to ask what they did, what the tool did, and how to let a reader tell the difference.

Taken together, these fragments are not enough to conclude that every student developed AI literacy. They are enough to make me believe that the course left something behind. At least some students moved from “follow the example” to “I have one more question.”

## The same course produced another echo at a U.S. summer camp

During the summer, I used a similar strategy while teaching high-school students at a summer camp in the United States. I still began with everyday questions, let students experiment in Colab, and used AI as a partner for asking, explaining, and debugging.

But the echo was different.

The camp students had chosen to be there. They did not suddenly lose a class to an exam week, and they did not have to redistribute their attention between a high-stakes school subject and an elective. Their levels were different, but the course began with a certain “I want to try this” disposition. With that starting point, the same course design more easily became a continuous sequence of attempts. Students were also more willing to voice an unfinished idea and revise it with others.

This experience is not evidence that American students are more motivated, or that one national system is better. It is a reminder that learning outcomes are shaped not only by materials and teachers, but also by whether students chose to come, whether they have time to return, and whether they can try again after failing.

In my life around public schools in Washington State, I have also noticed that schools do not automatically add another AI course. Exploration may instead be carried by families, community programs, camps, or private resources. That is an observation from the setting where I live, not a statement about every U.S. public school, and it does not mean the United States has no AI education. The U.S. Department of Education’s AI report makes the opposite point: AI education requires collaboration across federal, state, district, and school levels, while leaving room for local and individual decisions and protecting equity, safety, and human agency. [U.S. Department of Education AI Report](https://www.ed.gov/sites/ed/files/documents/ai-report/ai-report.pdf)

Putting the two settings together made one thing clearer to me: the same instructional design produces different learning echoes when the conditions for participation are different.

## Does Taiwan really need more AI education?

I think the answer is yes, but “more” should not mean only more class periods, more platforms, or more assignments that students are required to complete.

Taiwan’s curriculum framework already leaves room for diverse electives and cross-school collaboration. Schools can offer courses according to students’ interests, aptitudes, abilities, and needs, and they can work with other schools or universities. The [Guidelines for Curriculum Planning and Implementation in Senior High Schools](https://edu.law.moe.gov.tw/LawContent.aspx?id=GL001729) point less toward requiring every student to take the same AI course than toward giving students opportunities to encounter learning that fits them.

The difficulty is that as social anxiety about AI rises, policy makers, schools, and families can become eager to “give students some AI.” A free elective can quietly become another completion checklist. Participation may look high on the surface, while the moment a task asks for more time, another debugging attempt, or a complete explanation, sustained effort narrows to a small group.

That does not mean free electives are meaningless. It means they reveal something that a compulsory-course number often hides: whether students choose to go deeper is closely connected to whether they are given a real choice, enough support, and a way to connect learning back to their own lives.

So I do not think Taiwan needs simply to place AI on every student’s timetable. It needs more AI learning that students can encounter, choose, and receive support for. Students need to be able to say “I do not understand” without being shamed, return without being defined by one missed submission, and learn with teachers who have time to respond to different levels rather than only deliver content.

## Was I on the right path?

If I looked only at the decline in later submissions and the modest number of final shares, I could certainly question myself: Was the course not engaging enough? Was I simply not good at teaching? Had I made the tasks too difficult?

After revisiting the two years of course data, student responses, and projects, I am willing to write a more precise answer: the direction was right, and the design worked hard to meet beginners where they were. But free exploration needs more scaffolding than I originally thought.

I did what I could. I put abstract ideas into everyday situations. I broke large questions into steps that could be attempted within one class. I offered multiple points of entry through livestreams, recordings, Colab, GitHub, teaching assistants, and local teachers. I allowed students to use AI to clarify concepts and debug. I used project sharing so students could see how someone else approached a problem. None of this can guarantee that everyone will go deep, but it does lower the barrier to a first attempt.

What needs strengthening next is the route back in: separate basic and challenge tasks, provide offline data when an external website fails, turn debugging into short case studies, make “how I used AI” part of the project explanation, and treat final sharing as several small opportunities to speak rather than one last submission.

The goal is not to make the course heavier. It is to make sure that “I am stuck” does not have to mean “I have to leave.”

## Planting a small seed

After two years, I still do not know what this course will become. Perhaps more schools will join. Perhaps it will become a smaller and more carefully supported course. Perhaps its real influence will not appear in a course page at all, but years later when a former student faces a problem and remembers trying to work with a dataset in Python.

What I can do is open the door and make the first step low enough to take. I can show students that an error message is not a verdict, and that they can ask, revise, and try again. Whether someone opens Colab again on a particular afternoon, or remembers in a future job or daily life that “some problems can be approached by making a small program,” is not a result a teacher can control.

Maybe part of education is always a form of waiting.

Across these two years, I planted a small seed. It was briefly touched by different people through 25 cooperating schools, 29 school names in the 114-2 roster, and roughly two thousand student participations. Some stayed only for a moment; some walked a little farther. I do not need to divide those differences immediately into success or failure. They are traces of what happens when a seed meets different kinds of soil.

The rest is waiting for it to sprout in its own season.

## Course and project records

- [PythonAI4Beginners GitHub Repository](https://github.com/peculab/PythonAI4Beginners)
- [Course documents and 114-year materials (docs)](https://github.com/peculab/PythonAI4Beginners/tree/main/docs)
- [Course examples and practical notebooks (examples)](https://github.com/peculab/PythonAI4Beginners/tree/main/examples)
- [114-1 Final Learning Reflections and Small Projects (Issue #111)](https://github.com/peculab/PythonAI4Beginners/issues/111)
- [114-2 Final Learning Reflections and Small Projects (Issue #112)](https://github.com/peculab/PythonAI4Beginners/issues/112)
- [114-2 Submission Sheet and Detailed Responses](https://docs.google.com/spreadsheets/d/153JUE7Satz_0odxNOIfzfKdDc2Z-p51yO1txr7yIQjA/edit)
- [Report on Cross-School Distance AI Electives](https://www.tcnews.com.tw/education/item/27072.html)

The figures in this article come from the course team’s 114-1 and 114-2 records. The 114-1 grading records are not converted into a student count; 114-2 submission and self-assessment records are not the schools’ final grades. The estimates of roughly two thousand participations and nearly two hundred senior high and vocational schools describe the two-year reach of the course team. They are not a claim that every student completed the same learning experience.
