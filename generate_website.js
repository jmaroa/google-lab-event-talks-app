const fs = require('fs');
const path = require('path');

const placeholderTalks = [
    {
        title: "Introduction to Generative AI",
        speakers: ["Alice Johnson"],
        category: ["AI", "Machine Learning", "Innovation"],
        duration: 60, // minutes
        description: "An overview of generative AI, its applications, and future potential in various industries."
    },
    {
        title: "Mastering Node.js Performance",
        speakers: ["Bob Williams", "Charlie Davis"],
        category: ["Backend", "Node.js", "Performance"],
        duration: 60,
        description: "Deep dive into optimizing Node.js applications for speed, scalability, and resource efficiency."
    },
    {
        title: "Frontend Frameworks: A Comparative Study",
        speakers: ["Diana Miller"],
        category: ["Frontend", "Web Development", "JavaScript"],
        duration: 60,
        description: "A comprehensive comparison of popular frontend frameworks like React, Vue, and Angular, discussing their pros and cons."
    },
    {
        title: "Cloud Native Architectures with Kubernetes",
        speakers: ["Eve Brown"],
        category: ["DevOps", "Cloud", "Kubernetes"],
        duration: 60,
        description: "Building and deploying scalable, resilient applications using modern cloud-native principles and Kubernetes."
    },
    {
        title: "Data Visualization Best Practices",
        speakers: ["Frank Green"],
        category: ["Data Science", "Frontend", "UI/UX"],
        duration: 60,
        description: "Techniques and tools for creating effective, engaging, and informative data visualizations."
    },
    {
        title: "Security in Modern Web Applications",
        speakers: ["Grace Black", "Harry White"],
        category: ["Security", "Web Development", "Cybersecurity"],
        duration: 60,
        description: "Essential security practices and common vulnerabilities in developing robust web applications."
    }
];

function calculateSchedule(talks) {
    const scheduledEvents = [];
    let currentTime = new Date();
    currentTime.setHours(10, 0, 0, 0); // Start at 10:00 AM

    const addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60000);

    let talkIndex = 0;
    while (talkIndex < talks.length) {
        // Schedule talk
        if (talkIndex === 2) { // After 2nd talk, insert lunch and an extra transition
            const lunchStartTime = addMinutes(currentTime, 0);
            const lunchEndTime = addMinutes(lunchStartTime, 60); // 1 hour lunch
            scheduledEvents.push({
                type: "break",
                title: "Lunch Break",
                startTime: lunchStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                endTime: lunchEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                duration: 60
            });
            currentTime = addMinutes(lunchEndTime, 10); // 10 min transition after lunch
        }

        const talk = talks[talkIndex];
        const talkStartTime = addMinutes(currentTime, 0);
        const talkEndTime = addMinutes(talkStartTime, talk.duration);

        scheduledEvents.push({
            type: "talk",
            id: `talk-${talkIndex}`,
            ...talk,
            startTime: talkStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            endTime: talkEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });

        currentTime = addMinutes(talkEndTime, 10); // 10 min transition after talk
        talkIndex++;
    }
    return scheduledEvents;
}

const scheduledTalks = calculateSchedule(placeholderTalks);

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tech Event Schedule</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f7f6;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 960px;
            margin: 30px auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
        }
        header {
            background-color: #0056b3;
            color: white;
            padding: 20px 0;
            text-align: center;
            border-radius: 8px 8px 0 0;
            margin-bottom: 20px;
        }
        header h1 {
            margin: 0;
            font-size: 2.5em;
        }
        .search-container {
            margin-bottom: 25px;
            text-align: center;
            padding: 15px;
            background-color: #e9ecef;
            border-radius: 8px;
            border: 1px solid #dee2e6;
        }
        .search-container label {
            font-size: 1.1em;
            color: #495057;
            margin-right: 10px;
        }
        .search-container input[type="text"] {
            padding: 10px 15px;
            width: 70%;
            max-width: 300px;
            border: 1px solid #ced4da;
            border-radius: 5px;
            font-size: 1em;
            transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .search-container input[type="text"]:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
            outline: none;
        }
        .schedule-item {
            background-color: #f8f9fa;
            border: 1px solid #e0e0e0;
            margin-bottom: 15px;
            padding: 15px 20px;
            border-radius: 5px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .schedule-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.08);
        }
        .schedule-item.break {
            background-color: #ffeeba;
            border-color: #ffc107;
            color: #856404;
            text-align: center;
            font-weight: bold;
            font-size: 1.1em;
        }
        .schedule-item h3 {
            color: #0056b3;
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 1.5em;
        }
        .schedule-item.break h3 {
             color: #856404;
        }
        .schedule-item .time {
            font-weight: bold;
            color: #6c757d;
            margin-bottom: 10px;
            display: block;
        }
        .schedule-item .speakers, .schedule-item .category {
            font-size: 0.9em;
            color: #555;
            margin-bottom: 5px;
        }
        .schedule-item .category span {
            display: inline-block;
            background-color: #e9f5ff;
            color: #0056b3;
            border-radius: 3px;
            padding: 3px 8px;
            margin-right: 5px;
            margin-bottom: 5px;
            font-size: 0.85em;
        }
        .schedule-item .description {
            font-size: 0.95em;
            color: #444;
            margin-top: 10px;
        }
        footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            color: #6c757d;
            font-size: 0.9em;
            border-top: 1px solid #e0e0e0;
        }
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .container {
                margin: 20px;
                padding: 15px;
            }
            header h1 {
                font-size: 2em;
            }
            .search-container input[type="text"] {
                width: 90%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Technical Talks Event</h1>
            <p>A day of insightful discussions and cutting-edge technology.</p>
        </header>

        <div class="search-container">
            <label for="categorySearch">Filter by Category:</label>
            <input type="text" id="categorySearch" placeholder="e.g., AI, Node.js, Frontend">
        </div>

        <section id="schedule">
            <!-- Schedule items will be rendered here by JavaScript -->
        </section>

        <footer>
            <p>&copy; 2026 Tech Event. All rights reserved.</p>
        </footer>
    </div>

    <script>
        const scheduledEvents = ${JSON.stringify(scheduledTalks, null, 2)};

        function renderSchedule(eventsToRender) {
            const scheduleSection = document.getElementById('schedule');
            scheduleSection.innerHTML = ''; // Clear previous entries

            eventsToRender.forEach(event => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('schedule-item');
                if (event.type === 'break') {
                    itemDiv.classList.add('break');
                    itemDiv.innerHTML = '<span class="time">' + event.startTime + ' - ' + event.endTime + '</span>' +
                                        '<h3>' + event.title + '</h3>';
                } else {
                    itemDiv.innerHTML = '<span class="time">' + event.startTime + ' - ' + event.endTime + '</span>' +
                                        '<h3>' + event.title + '</h3>' +
                                        '<p class="speakers"><strong>Speaker(s):</strong> ' + event.speakers.join(', ') + '</p>' +
                                        '<p class="category"><strong>Categories:</strong> ' + event.category.map(cat => '<span>' + cat + '</span>').join('') + '</p>' +
                                        '<p class="description">' + event.description + '</p>';
                }
                scheduleSection.appendChild(itemDiv);
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            renderSchedule(scheduledEvents);

            const categorySearchInput = document.getElementById('categorySearch');
            categorySearchInput.addEventListener('keyup', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filteredEvents = scheduledEvents.filter(event => {
                    if (event.type === 'break') return true; // Always show breaks
                    return event.category.some(cat => cat.toLowerCase().includes(searchTerm));
                });
                renderSchedule(filteredEvents);
            });
        });
    </script>
</body>
</html>
`;

const outputPath = path.join(__dirname, 'index.html');
fs.writeFileSync(outputPath, htmlContent, 'utf8');
console.log(`Successfully generated index.html at: \${outputPath}`);
