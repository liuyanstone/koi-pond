# Koi Pond / 锦鲤小池

An original, bilingual fish-tracking game for GitHub Pages. Public website, no account or ChatGPT required.

## Daily play

Each local calendar day has three ponds, in order:

| Pond | Koi | First round timer | Initial wait between pellets |
| --- | ---: | ---: | ---: |
| Easy | 6 | 18 seconds | 0.65 seconds |
| Medium | 8 | 24 seconds | 0.95 seconds |
| Hard | 10 | 30 seconds | 1.25 seconds |

Every round requires feeding each fish exactly once. Tap/click a fish, or Tab to a fish and use Enter/Space. A brief ripple confirms the feed. Fish keep swimming and do not retain a fed marker or change appearance. Wait for the pellet ring to refill; early taps are ignored, including double clicks during the wait. Clicking water does not consume food or end the pond.

After a successful round, select the next round. The feeding list resets. Actual swimming speeds, in the pond's 720×500 coordinate system, are:

| Koi count | Round 1 | Round 2 | Round 3 |
| --- | ---: | ---: | ---: |
| 6 | 60 | 120 | 200 |
| 8 | 60 | 100 | 160 |
| 10 | 60 | 90 | 150 |

The speed display shows these absolute values per second rather than multipliers. Fish have fully golden-red bodies, tails and fins, with warm gradient shading and fine scale details instead of a white base with large spots. Their appearance stays unchanged after feeding.
 Each round's timer is 0.6 seconds shorter and pellet wait 0.09 seconds longer than the prior round. These are original tuning choices, not claimed Lumosity specifications. Tracking becomes progressively harder, with a maximum of three rounds per pond. Clearing all three earns pond mastery rather than forcing a failure.

A repeated feed after the pellet is ready, or running out of time with unfed fish, ends the current pond. Completed rounds retain their points. Continue to the next daily pond. After three ponds, a difficulty chooser unlocks. Play fresh Easy, Medium or Hard ponds one at a time, with no daily replay limit. Finish the current pond before choosing another. Each replay resets the rounds, timer, cooldown, feeding list and fish, while keeping the day’s completed best scores. An unfinished replay resumes after reopening. A new date starts three fresh starter ponds before replays unlock again.

## Scoring

Only complete rounds earn points. Each earns the sum 10 + 20 + ... + (10 × fish count), plus a pond bonus multiplied by the round number. Bonuses are 50 for Easy, 100 for Medium and 200 for Hard. The daily total is the highest completed Easy pond score + highest completed Medium pond score + highest completed Hard pond score. Initial daily ponds and all replays count toward these bests. Lower scores and unfinished replays never reduce the total; attempts at the same difficulty are not added together. Existing saves retain their completed scores. An unfinished feeding round earns no points. Completed ponds are recorded once.

## Pause and saved progress

Pause, opening instructions, losing window focus, or hiding the page stops the countdown. The paused overlay hides fish so pausing does not reveal a static feeding map. Reopening resumes with a paused pond. Fish positions, round, feeding memory, cooldown, remaining time, scores, language and sound preference are saved on the same browser/device. Scores are local, with no sign-in or cross-device synchronization. A new local calendar date starts its own three ponds; prior scores remain in history.

## Reference and original design

Lumosity's public [Playing Koi instructions](https://help.lumosity.com/hc/en-us/articles/12757224177815-Playing-Koi) describe feeding each fish once, a delay between pellets, and escalating feed points. This game uses those public mechanics as a reference and follows the requested daily ponds, round countdown, failure conditions and increasing swim speeds. The published reference does not disclose exact swim speeds, fish counts or timer schedules. Artwork, interface, motion, daily structure and timing in this repository are original. This game is not affiliated with Lumosity and does not use its source code, graphics or recordings.

## Development

Buildless HTML, CSS, SVG and JavaScript modules. Serve this folder with `python3 -m http.server 8781`. Do not open index.html with a file URL; the ES modules require HTTP(S).

Run `node check.mjs` with Node.js. Checks cover three rounds at each of three levels, score calculation, duplicate feeds, cooldown, timeout, pause/resume, hit testing, saved progress, date rollover, corruption handling, English/Chinese parity and 90 motion simulations. Browser checks additionally cover moving-fish pointer input, keyboard feeding, round advancement, cooldown protection, Chinese text, pause/reload and daily score completion, replay unlock, fresh fish, higher/lower replay scores, unfinished replay protection, and replay pause/reload.

Publish the main branch root using GitHub Pages. Google Fonts are optional and have local font fallbacks. Sounds use local Web Audio synthesis, with no microphone or downloads. No analytics, ads, server, or external game API is used.

Earlier completed results retain their original fish-count and six-round scoring, marked “Earlier score” in the table. Store version 2 keeps these records alongside new three-round results without recalculating old points using the new fish counts. Unfinished old-rule ponds restart at the same daily stage or replay attempt with the new fish counts and clear feeding memory.
