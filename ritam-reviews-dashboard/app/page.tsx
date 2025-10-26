"use client";

import { useMemo, useState } from "react";

type Sentiment = "positive" | "neutral" | "negative";
type ReviewSource = "google" | "makemytrip" | "booking" | "tripadvisor" | "expedia";

type Review = {
  id: string;
  guestName: string;
  location: string;
  source: ReviewSource;
  rating: number;
  stayDate: string;
  snippet: string;
  fullText: string;
  sentiment: Sentiment;
  keywords: string[];
  responseDueInHours: number;
  aiSummary: string;
  aiActions: string[];
};

const sourceMeta: Record<ReviewSource, { label: string; accent: string; bg: string }> = {
  google: { label: "Google", accent: "text-[#4285F4]", bg: "bg-[#E8F0FE]" },
  makemytrip: { label: "MakeMyTrip", accent: "text-[#E43D40]", bg: "bg-[#FDECEC]" },
  booking: { label: "Booking.com", accent: "text-[#003580]", bg: "bg-[#D6E4FF]" },
  tripadvisor: { label: "Tripadvisor", accent: "text-[#34E0A1]", bg: "bg-[#DCF9ED]" },
  expedia: { label: "Expedia", accent: "text-[#FFB700]", bg: "bg-[#FFF6DB]" },
};

const sentimentMeta: Record<Sentiment, { label: string; color: string; dot: string }> = {
  positive: { label: "Positive", color: "text-green-600", dot: "bg-emerald-500" },
  neutral: { label: "Neutral", color: "text-slate-600", dot: "bg-slate-400" },
  negative: { label: "Negative", color: "text-rose-600", dot: "bg-rose-500" },
};

const reviews: Review[] = [
  {
    id: "rv-1001",
    guestName: "Priya S.",
    location: "Mumbai",
    source: "google",
    rating: 4.6,
    stayDate: "08 Jul 2024",
    snippet: "Loved the rooftop infinity pool and the courteous staff…",
    fullText:
      "We stayed here for a quick weekend getaway and absolutely loved the rooftop infinity pool. The staff went out of their way to arrange a late-night meal for my parents, which was such a thoughtful gesture. Rooms are spotless and the breakfast spread is excellent.",
    sentiment: "positive",
    keywords: ["rooftop pool", "staff", "breakfast"],
    responseDueInHours: 3,
    aiSummary: "Guest highlights service excellence and premium amenities. Maintain concierge responsiveness.",
    aiActions: [
      "Send a thank-you response highlighting rooftop pool service.",
      "Invite the guest to try the new monsoon tasting menu.",
      "Tag this review under ‘Service Praise’ for marketing.",
    ],
  },
  {
    id: "rv-1002",
    guestName: "Rahul M.",
    location: "Bengaluru",
    source: "makemytrip",
    rating: 3.2,
    stayDate: "05 Jul 2024",
    snippet: "Rooms were modern but check-in was painfully slow…",
    fullText:
      "Rooms are modern and well maintained. However, the check-in process took more than 35 minutes despite prior confirmation. The front desk seemed understaffed for a Friday evening. Breakfast options could be better for vegan travelers.",
    sentiment: "neutral",
    keywords: ["check-in", "front desk", "breakfast"],
    responseDueInHours: 1,
    aiSummary: "Operational bottleneck at front desk and dietary gap in buffet.",
    aiActions: [
      "Acknowledge the delay and assure process improvement.",
      "Offer a personalised fast-track check-in for next stay.",
      "Loop F&B team to add at least two vegan mains this weekend.",
    ],
  },
  {
    id: "rv-1003",
    guestName: "Ananya R.",
    location: "Delhi",
    source: "booking",
    rating: 4.9,
    stayDate: "02 Jul 2024",
    snippet: "Best spa experience and curated local tours made our stay memorable…",
    fullText:
      "Probably the best urban spa in Delhi. The therapists were skilled and the concierge curated a personalised food tour in Old Delhi for us. Small touches like welcome mithai and bedtime kahwa made it extra special.",
    sentiment: "positive",
    keywords: ["spa", "concierge", "local experience"],
    responseDueInHours: 8,
    aiSummary: "Premium wellness and concierge team are delighting guests.",
    aiActions: [
      "Feature the concierge experience in this month’s Instagram story.",
      "Upsell spa membership to the guest via follow-up mail.",
      "Add this review to the ‘Local Experiences’ campaign.",
    ],
  },
  {
    id: "rv-1004",
    guestName: "Vikram H.",
    location: "Hyderabad",
    source: "tripadvisor",
    rating: 2.8,
    stayDate: "29 Jun 2024",
    snippet: "AC kept switching off at night and housekeeping response was slow…",
    fullText:
      "The location is amazing but the air-conditioning in our room kept tripping through the night. Housekeeping took almost an hour to respond and eventually moved us to another floor at 2 am. Breakfast spread was nice though.",
    sentiment: "negative",
    keywords: ["air-conditioning", "housekeeping", "response time"],
    responseDueInHours: 0,
    aiSummary: "Infrastructure issue causing discomfort and slow escalation response.",
    aiActions: [
      "Escalate to engineering to inspect AC units on level 12 today.",
      "Offer complimentary dinner for the inconvenience.",
      "Review night shift escalation matrix with housekeeping lead.",
    ],
  },
  {
    id: "rv-1005",
    guestName: "Meera T.",
    location: "Goa",
    source: "expedia",
    rating: 4.1,
    stayDate: "24 Jun 2024",
    snippet: "Sunset cabanas were dreamy but airport transfer coordination can improve…",
    fullText:
      "Loved the tropical vibe and sunset cabanas right on the beach. Our only concern was the delayed airport transfer—driver arrived 20 minutes late and there was no proactive update. Otherwise, staff is cheerful and food is authentic.",
    sentiment: "neutral",
    keywords: ["airport transfer", "cabanas", "food"],
    responseDueInHours: 6,
    aiSummary: "Transport coordination needs tightening; guest loved beach experiences.",
    aiActions: [
      "Share transport partner escalation number with concierge desk.",
      "Invite guest to upcoming beach sundowner event.",
      "Tag this review under ‘Logistics Watchlist’.",
    ],
  },
];

const averageRating = (
  reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
).toFixed(1);

const positiveRatio = Math.round(
  (reviews.filter((review) => review.sentiment === "positive").length /
    reviews.length) *
    100
);

const averageResponseSla = Math.round(
  reviews.reduce((acc, review) => acc + review.responseDueInHours, 0) / reviews.length
);

const fastestResponseSla = Math.min(...reviews.map((review) => review.responseDueInHours));

function formatRating(rating: number) {
  return rating.toFixed(1);
}

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => {
    const threshold = index + 1;
    const isHalf = rating + 0.5 >= threshold && rating < threshold;
    const isFilled = rating >= threshold;
    const symbol = isFilled || isHalf ? "★" : "☆";

    return (
      <span
        key={index}
        className={`text-base leading-none ${
          isFilled ? "text-amber-500" : isHalf ? "text-amber-300" : "text-slate-300"
        }`}
      >
        {symbol}
      </span>
    );
  });
}

export default function Home() {
  const [selectedReviewId, setSelectedReviewId] = useState(reviews[0].id);

  const selectedReview = useMemo(
    () => reviews.find((review) => review.id === selectedReviewId) ?? reviews[0],
    [selectedReviewId]
  );

  return (
    <main className="min-h-screen bg-transparent px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-6 rounded-3xl bg-white/80 p-6 shadow-floating backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3rem] text-brand-500">
                Ritam Reviews Dashboard
              </p>
              <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
                Review Intelligence for Hotel Managers, India
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Monitor cross-platform guest sentiment, prioritise responses, and turn high-impact feedback into action within minutes.
              </p>
            </div>
            <div className="flex flex-col items-end gap-3 text-right">
              <span className="rounded-full bg-brand-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
                Live Sync · 4 sources
              </span>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Responding within {averageResponseSla} hrs SLA
                </span>
                <span className="inline-flex items-center gap-2 text-slate-400">
                  <span className="size-2 animate-pulseGlow rounded-full bg-brand-500" />
                  Auto AI summaries enabled
                </span>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile
              title="Average Rating"
              value={averageRating}
              trend="▲ 0.3 vs last week"
              tone="positive"
            />
            <StatTile
              title="Positive Sentiment"
              value={`${positiveRatio}%`}
              trend="₹ 1.4L impact potential"
              tone="neutral"
            />
            <StatTile
              title="Response SLA"
              value={`≤ ${fastestResponseSla} hrs`}
              trend="2 escalations pending"
              tone="alert"
            />
            <StatTile
              title="Focus Theme"
              value="Service Excellence"
              trend="12 mentions this week"
              tone="neutral"
            />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(320px,360px)_1fr]">
          <div className="flex flex-col gap-4 overflow-hidden rounded-3xl bg-white/95 p-4 shadow-subtle">
            <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Unified Review Feed</h2>
                  <p className="text-xs text-slate-500">
                    Latest sync {new Date().toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-brand-200 hover:text-brand-600">
                  Export CSV
                </button>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white p-2 shadow-inner">
                <input
                  type="text"
                  placeholder="Search for guest name, keyword, or source"
                  className="w-full rounded-full border-none bg-transparent text-sm text-slate-600 outline-none focus:ring-0"
                />
                <span className="rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  AI Filter
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Last 7 days",
                  "Needs response",
                  "High impact",
                  "Positive",
                  "Negative",
                ].map((label) => (
                  <button
                    key={label}
                    className="rounded-full border border-transparent bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm transition hover:border-brand-200 hover:text-brand-600"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-2">
              {reviews.map((review) => {
                const source = sourceMeta[review.source];
                const sentiment = sentimentMeta[review.sentiment];
                const isSelected = selectedReviewId === review.id;

                return (
                  <button
                    key={review.id}
                    onClick={() => setSelectedReviewId(review.id)}
                    className={`group flex w-full flex-col gap-3 rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-brand-200 bg-brand-50 shadow-subtle"
                        : "border-transparent bg-white hover:border-brand-100 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex size-10 items-center justify-center rounded-full ${source.bg}`}>
                          <span className={`text-sm font-semibold ${source.accent}`}>
                            {source.label[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {review.guestName}
                            <span className="ml-2 text-xs font-medium text-slate-400">
                              {review.location}
                            </span>
                          </p>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <span className="font-medium">{source.label}</span>
                            <span>•</span>
                            <span>{review.stayDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end text-xs text-slate-500">
                        <div className="flex items-center gap-1 text-amber-500">
                          <span className="text-base font-semibold text-slate-900">
                            {formatRating(review.rating)}
                          </span>
                          <div className="flex items-center gap-0.5">{renderStars(review.rating)}</div>
                        </div>
                        <span className="mt-1 inline-flex items-center gap-2 text-xs">
                          <span className={`size-2 rounded-full ${sentiment.dot}`} />
                          <span className={sentiment.color}>{sentiment.label}</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600">
                      {review.snippet}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {review.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-500"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>
                        SLA: Respond within <span className="font-semibold text-brand-600">{review.responseDueInHours}h</span>
                      </span>
                      <span className="hidden items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 transition group-hover:border-brand-300 group-hover:text-brand-600 sm:inline-flex">
                        View details
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex h-full flex-col gap-5 rounded-3xl bg-white/95 p-6 shadow-subtle">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Review Insights</h2>
                <p className="text-sm text-slate-500">
                  Deep dive into guest sentiment, AI actions, and context.
                </p>
              </div>
              <button className="rounded-full border border-brand-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand-600 transition hover:bg-brand-500 hover:text-white">
                Respond Now
              </button>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto pr-1">
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Selected Guest
                    </p>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {selectedReview.guestName}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Stayed on {selectedReview.stayDate} · {sourceMeta[selectedReview.source].label}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`flex size-10 items-center justify-center rounded-full ${sourceMeta[selectedReview.source].bg}`}>
                        <span className={`text-sm font-semibold ${sourceMeta[selectedReview.source].accent}`}>
                          {sourceMeta[selectedReview.source].label[0]}
                        </span>
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        <p className="font-medium text-slate-900">{sourceMeta[selectedReview.source].label}</p>
                        <p>{selectedReview.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="font-semibold text-slate-900">
                        {formatRating(selectedReview.rating)}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {renderStars(selectedReview.rating)}
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${sentimentMeta[selectedReview.sentiment].color} ${selectedReview.sentiment === "positive" ? "bg-emerald-50" : selectedReview.sentiment === "negative" ? "bg-rose-50" : "bg-slate-100"}`}>
                      <span className={`size-2 rounded-full ${sentimentMeta[selectedReview.sentiment].dot}`} />
                      {sentimentMeta[selectedReview.sentiment].label}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                  {selectedReview.fullText}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <h4 className="text-sm font-semibold text-slate-900">AI Sentiment Analysis</h4>
                  <p className="mt-2 text-sm text-slate-600">
                    {selectedReview.aiSummary}
                  </p>
                  <div className="mt-4 space-y-2">
                    {selectedReview.aiActions.map((action) => (
                      <div key={action} className="flex items-start gap-3 rounded-xl bg-slate-50/80 p-3">
                        <span className="mt-1 size-2 shrink-0 rounded-full bg-brand-500" />
                        <p className="text-sm text-slate-600">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <h4 className="text-sm font-semibold text-slate-900">Conversation Toolkit</h4>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    <li className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                      Personalised opener crafted for {selectedReview.guestName.split(" ")[0]}.
                    </li>
                    <li className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                      Suggest mentioning {selectedReview.keywords[0]} and {selectedReview.keywords[1] ?? "hospitality"} improvements.
                    </li>
                    <li className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                      Set reminder to follow up in 24 hours if no response.
                    </li>
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedReview.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full border border-brand-200/60 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600"
                      >
                        #{keyword.split(" ").join("")}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h4 className="text-sm font-semibold text-slate-900">Platform Trendlines</h4>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {Object.entries(sourceMeta).map(([key, meta]) => {
                    const reviewsFromSource = reviews.filter(
                      (review) => review.source === key
                    );
                    const average = reviewsFromSource.length
                      ? (
                          reviewsFromSource.reduce((acc, review) => acc + review.rating, 0) /
                          reviewsFromSource.length
                        ).toFixed(1)
                      : "—";

                    return (
                      <div
                        key={key}
                        className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex size-9 items-center justify-center rounded-full ${meta.bg}`}>
                            <span className={`text-sm font-semibold ${meta.accent}`}>
                              {meta.label[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{meta.label}</p>
                            <p className="text-xs text-slate-500">{reviewsFromSource.length} reviews</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Avg rating
                          </p>
                          <p className="text-lg font-semibold text-slate-900">{average}</p>
                          <p className="text-xs text-emerald-600">Trending +0.2 vs last week</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatTile({
  title,
  value,
  trend,
  tone,
}: {
  title: string;
  value: string;
  trend: string;
  tone: "positive" | "neutral" | "alert";
}) {
  const toneClasses = {
    positive: {
      bg: "bg-brand-50",
      text: "text-brand-700",
      accent: "text-brand-600",
    },
    neutral: {
      bg: "bg-slate-50",
      text: "text-slate-700",
      accent: "text-slate-500",
    },
    alert: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      accent: "text-rose-500",
    },
  } as const;

  return (
    <div className={`rounded-2xl border border-white/60 p-4 shadow-sm ${toneClasses[tone].bg}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {title}
      </p>
      <p className={`mt-2 text-3xl font-semibold ${toneClasses[tone].text}`}>{value}</p>
      <p className={`mt-2 text-xs font-medium ${toneClasses[tone].accent}`}>{trend}</p>
    </div>
  );
}
