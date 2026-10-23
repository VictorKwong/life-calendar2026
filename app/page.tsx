
"use client";

import { useEffect, useState } from "react";

const TOTAL_YEARS = 100;
const WEEKS_PER_YEAR = 52;
const TOTAL_WEEKS = TOTAL_YEARS * WEEKS_PER_YEAR;
const STORAGE_KEY = "life-calendar-current-week";

export default function Home() {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Load the saved current week
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved !== null) {
        const parsed = Number(saved);

        if (
          Number.isInteger(parsed) &&
          parsed >= 0 &&
          parsed <= TOTAL_WEEKS
        ) {
          setCurrentWeek(parsed);
        }
      }
    } catch {
      console.error("Could not load saved calendar.");
    } finally {
      setLoaded(true);
    }
  }, []);

  // Save progress automatically
  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, String(currentWeek));
    } catch {
      console.error("Could not save calendar.");
    }
  }, [currentWeek, loaded]);

  // Selecting a week makes it the current week.
  // All earlier weeks become black; all later weeks become white.
  function selectWeek(week: number) {
    setCurrentWeek(week);
  }

  // Select the last week of a year
  function selectYear(year: number) {
    setCurrentWeek(year * WEEKS_PER_YEAR);
  }

  function resetCalendar() {
    if (window.confirm("Clear all marked weeks?")) {
      setCurrentWeek(0);
    }
  }

  const percentage = (
    (currentWeek / TOTAL_WEEKS) * 100
  ).toFixed(1);

  return (
    <main className="page">
      <header className="header">
        <div>
          <h1>
            100-Year Life Calendar
            <span className="subtitle"> - Time is precious</span>
          </h1>
        </div>

        <div className="stats" aria-live="polite">
          <div className="stat">
            <span className="stat-number">
              {currentWeek.toLocaleString()}
            </span>
            <span className="stat-label">
              {" "}/ 5,200 Weeks marked -
            </span>
            <span className="stat-number">
              {" "}{percentage}%
            </span>
          </div>

          <div className="stat">

          </div>
        </div>
      </header>

      <section className="legend" aria-label="Calendar controls">
        <span className="legend-item">
          <i className="legend-box filled" aria-hidden="true" />
          Your progress is saved automatically on this device. {" "}
        </span>

        <button
          type="button"
          className="reset-button"
          onClick={resetCalendar}
        >
          Reset calendar
        </button>
      </section>

      <section
        className="calendar"
        aria-label="100-year life calendar"
      >
        <div className="calendar-header">
          <div className="header-spacer">Year</div>

          <div className="week-numbers" aria-hidden="true">
            {Array.from(
              { length: WEEKS_PER_YEAR },
              (_, index) => (
                <span key={index}>{index + 1}</span>
              )
            )}
          </div>
        </div>

        {Array.from(
          { length: TOTAL_YEARS },
          (_, yearIndex) => {
            const year = yearIndex + 1;
            const startWeek =
              yearIndex * WEEKS_PER_YEAR + 1;
            const endWeek =
              year * WEEKS_PER_YEAR;

            const isYearCompleted = currentWeek >= endWeek;

            return (
              <div
                className={`year-row ${
                  isYearCompleted ? "year-completed" : ""
                }`}
                key={year}
              >
                <button
                  type="button"
                  className="year-label"
                  onClick={() => selectYear(year)}
                  title={`Select the end of Year ${year}, week ${endWeek}`}
                  aria-label={`Select the end of year ${year}, week ${endWeek}`}
                >
                  <span className="year-number">
                    {year}
                  </span>
                  <span className="year-text">
                    Year {year}
                  </span>
                  <span className="year-weeks">
                    Weeks {startWeek}–{endWeek}
                  </span>
                </button>

                <div className="week-grid">
                  {Array.from(
                    { length: WEEKS_PER_YEAR },
                    (_, weekIndex) => {
                      const week =
                        yearIndex * WEEKS_PER_YEAR +
                        weekIndex +
                        1;

                      const isFilled = week <= currentWeek;

                      return (
                        <button
                          key={week}
                          type="button"
                          className={`week ${
                            isFilled ? "week-filled" : ""
                          }`}
                          onClick={() => selectWeek(week)}
                          aria-label={`Year ${year}, week ${
                            weekIndex + 1
                          }, overall week ${week}, ${
                            isFilled ? "elapsed" : "future"
                          }`}
                          aria-pressed={week === currentWeek}
                          title={`Year ${year}, Week ${
                            weekIndex + 1
                          } (overall week ${week})`}
                        />
                      );
                    }
                  )}
                </div>
              </div>
            );
          }
        )}
      </section>

      <footer className="footer">
        <a
          href="https://victorkaiwong.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="portfolio-link"
        >
          <span className="copyright-text">
            Copyright © 2025 Victor Wong
          </span>
          <span className="portfolio-text">
            Visit My Portfolio 🍌 / Game code: Unlock1218
          </span>
        </a>
      </footer>
    </main>
  );
}
