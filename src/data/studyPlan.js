export const STUDY_PLAN = [
  {
    week: 1,
    title: "Digital fundamentals + SV data types",
    subtitle: "H&H Ch 1–4 · Sutherland Ch 1–4",
    phase: "Phase 1 — Digital foundations + SV syntax",
    days: [
      { id: "w1d1", day: "Mon", task: "H&H Ch 1–2: binary, boolean, gates, Karnaugh maps", book: "H&H", side: "Write truth tables by hand" },
      { id: "w1d2", day: "Tue", task: "H&H Ch 3: sequential logic — latches, flip-flops, FSMs", book: "H&H", side: "Draw Mealy vs Moore state diagrams" },
      { id: "w1d3", day: "Wed", task: "SV-D Ch 1–2: SV intro, packages, declaration spaces", book: "SV-D", side: "Install Questa/ModelSim, run first file" },
      { id: "w1d4", day: "Thu", task: "SV-D Ch 3–4: data types, 2-state vs 4-state, enums, typedef", book: "SV-D", side: "Write small testbench, observe X/Z" },
      { id: "w1d5", day: "Fri", task: "SV-D Ch 5: arrays, structs, unions", book: "SV-D", side: "ChipVerify: SV arrays exercises" },
      { id: "w1d6", day: "Sat", task: "Code from scratch: 4-bit adder, 2-to-1 mux, D flip-flop in SV", book: "PR", side: "No copy-paste — whiteboard style", resumeLink: "Gate-level basics underpin every datapath you claim — MoE accelerator, 1D Conv Accelerator" },
      { id: "w1d7", day: "Sun", task: "Review + flashcards: blocking vs non-blocking, 4-state types", book: "Review", side: "Rest if needed" }
    ]
  },
  {
    week: 2,
    title: "RTL coding — FSMs, procedures, interfaces",
    subtitle: "Sutherland Ch 5–10 · H&H Ch 4",
    phase: "Phase 1 — Digital foundations + SV syntax",
    days: [
      { id: "w2d1", day: "Mon", task: "SV-D Ch 6–7: procedural blocks (always_ff, always_comb), tasks, functions", book: "SV-D", side: "Know why always_ff beats always" },
      { id: "w2d2", day: "Tue", task: "SV-D Ch 8: FSM modeling — one-hot, binary encoding, synthesis guidelines", book: "SV-D", side: "Code Mealy + Moore FSM for traffic light" },
      { id: "w2d3", day: "Wed", task: "SV-D Ch 9–10: design hierarchy, interfaces, modports", book: "SV-D", side: "Rewrite AXI interface using modports" },
      { id: "w2d4", day: "Thu", task: "H&H Ch 4: hardware description languages — compare Verilog style to SV", book: "H&H", side: "Spot synthesis vs simulation constructs" },
      { id: "w2d5", day: "Fri", task: "SV-D Ch 11–12: complete design example, behavioral modeling", book: "SV-D", side: "Read every line of Ch 11 full design" },
      { id: "w2d6", day: "Sat", task: "Code from scratch: synchronous FIFO, parameterized counter, Gray code", book: "PR", side: "Simulate in Questa, check waveforms", resumeLink: "Directly defends MAX10 timing project (FSMD + FIFO) and AXI4-Stream FIFO buffering in 1D Conv Accelerator" },
      { id: "w2d7", day: "Sun", task: "Review week 1–2. Explain blocking vs non-blocking out loud", book: "Review", side: "Record yourself if possible" }
    ]
  },
  {
    week: 3,
    title: "SV testbench + verification concepts",
    subtitle: "Spear Ch 1–4 · Bergeron Ch 1–2",
    phase: "Phase 2 — Verification fundamentals",
    days: [
      { id: "w3d1", day: "Mon", task: "SV-V Ch 1: verification guidelines, layered testbench, coverage-driven flow", book: "SV-V", side: "Map to your UVM packet filter project" },
      { id: "w3d2", day: "Tue", task: "SV-V Ch 2: SV data types for verification — queues, dynamic arrays, associative arrays", book: "SV-V", side: "ChipVerify: arrays + queues drill" },
      { id: "w3d3", day: "Wed", task: "SV-V Ch 3: procedural statements, routines, void functions, automatic tasks", book: "SV-V", side: "Rewrite a task from your old testbench" },
      { id: "w3d4", day: "Thu", task: "SV-V Ch 4: interfaces, clocking blocks, program blocks", book: "SV-V", side: "Understand race-free testbench concept" },
      { id: "w3d5", day: "Fri", task: "TB Ch 1–2: testbench structure, stimulus/response, self-checking basics", book: "TB", side: "Compare Bergeron vs Spear methodology" },
      { id: "w3d6", day: "Sat", task: "Build self-checking testbench for UART TX module from scratch", book: "PR", side: "Include clocking block, interface", resumeLink: "Same skill family as your Forbes Marshall UART/I2C/SPI protocol verification work" },
      { id: "w3d7", day: "Sun", task: "Explain UVM packet filter to yourself as if in interview — no notes", book: "Review", side: "Note every gap in your explanation" }
    ]
  },
  {
    week: 4,
    title: "OOP, randomization, coverage",
    subtitle: "Spear Ch 5–6 · Bergeron Ch 3–4",
    phase: "Phase 2 — Verification fundamentals",
    days: [
      { id: "w4d1", day: "Mon", task: "SV-V Ch 5: OOP basics — class, handle, constructor, this, inheritance", book: "SV-V", side: "Key: handles vs objects vs values" },
      { id: "w4d2", day: "Tue", task: "SV-V Ch 6: randomization — rand/randc, constraints, solve-before", book: "SV-V", side: "Write 5 constraint puzzles, solve them" },
      { id: "w4d3", day: "Wed", task: "TB Ch 3–4: constrained random stimulus, functional coverage basics", book: "TB", side: "Map to your 100% coverage closure claim" },
      { id: "w4d4", day: "Thu", task: "SV-V Ch 9: functional coverage — covergroup, coverpoint, bins, cross coverage", book: "SV-V", side: "Write covergroup for AXI handshake" },
      { id: "w4d5", day: "Fri", task: "H&H Ch 7: memory arrays — SRAM/DRAM — connect to your 6T SRAM project", book: "H&H", side: "Be able to explain cell ratio tradeoffs" },
      { id: "w4d6", day: "Sat", task: "Add constrained random sequences + functional coverage to your UART TB", book: "PR", side: "Target 90%+ coverage closure", resumeLink: "This is literally the skill behind your '100% functional and code coverage' UVM Packet Filter bullet" },
      { id: "w4d7", day: "Sun", task: "Mock Q&A: explain solve-before, randc, coverage plan out loud", book: "Review", side: "Write answers, not just think them" }
    ]
  },
  {
    week: 5,
    title: "UVM architecture deep dive",
    subtitle: "Bergeron Ch 5–7 · Spear Ch 7–8",
    phase: "Phase 3 — UVM + advanced verification",
    days: [
      { id: "w5d1", day: "Mon", task: "TB Ch 5: UVM hierarchy — uvm_env, uvm_agent, uvm_driver, uvm_monitor", book: "TB", side: "Draw the hierarchy from memory" },
      { id: "w5d2", day: "Tue", task: "TB Ch 6: UVM phases — build, connect, run, check, report", book: "TB", side: "Know phase order cold — interview staple" },
      { id: "w5d3", day: "Wed", task: "TB Ch 7: TLM ports — uvm_analysis_port, blocking_put_port, FIFOs", book: "TB", side: "Trace data flow driver→monitor→scoreboard" },
      { id: "w5d4", day: "Thu", task: "SV-V Ch 7: fork-join, mailboxes, semaphores, events for inter-thread comms", book: "SV-V", side: "Critical for multi-agent testbenches" },
      { id: "w5d5", day: "Fri", task: "SV-V Ch 8: advanced OOP — virtual classes, polymorphism, factory pattern", book: "SV-V", side: "UVM factory override is an interview must" },
      { id: "w5d6", day: "Sat", task: "Build minimal UVM env from scratch for SPI: agent, driver, monitor, scoreboard", book: "PR", side: "No copy from your old project", resumeLink: "Rebuilding this from scratch is what lets you defend the UVM Packet Filter env/agent/scoreboard architecture without notes" },
      { id: "w5d7", day: "Sun", task: "Explain full UVM phase flow and TLM ports out loud — record it", book: "Review", side: "You must explain this in any DV interview" }
    ]
  },
  {
    week: 6,
    title: "SVA assertions + advanced UVM",
    subtitle: "Spear Ch 10–11 · Bergeron Ch 8–9",
    phase: "Phase 3 — UVM + advanced verification",
    days: [
      { id: "w6d1", day: "Mon", task: "SV-V Ch 10: virtual interfaces — why needed, how to pass through config_db", book: "SV-V", side: "This trips most candidates up" },
      { id: "w6d2", day: "Tue", task: "SVA: immediate vs concurrent assertions, sequences, properties, |-> vs |=>", book: "SV-V", side: "Write assertions for AXI handshake rules" },
      { id: "w6d3", day: "Wed", task: "TB Ch 8–9: sequences, virtual sequences, config objects, uvm_config_db", book: "TB", side: "Config_db is asked in 80% of DV interviews" },
      { id: "w6d4", day: "Thu", task: "SV-V Ch 11: complete testbench walkthrough — study every design choice", book: "SV-V", side: "This is the masterclass chapter" },
      { id: "w6d5", day: "Fri", task: "H&H Ch 8: I/O systems — AXI, memory-mapped peripherals", book: "H&H", side: "Refresh AXI4-Stream back-pressure rules" },
      { id: "w6d6", day: "Sat", task: "Add SVA assertions + virtual sequences to your SPI UVM env", book: "PR", side: "Run coverage closure, debug failures", resumeLink: "Assertions on handshake rules map directly to your 'AXI-Stream handshaking under back-pressure' verification claim (1D Conv Accelerator)" },
      { id: "w6d7", day: "Sun", task: "Write answers to 20 DV interview questions — ChipVerify interview prep", book: "Review", side: "No looking up answers first" }
    ]
  },
  {
    week: 7,
    title: "Computer architecture + STA basics",
    subtitle: "H&H Ch 5–7 · STA concepts",
    phase: "Phase 4 — Computer arch + timing + interview prep",
    days: [
      { id: "w7d1", day: "Mon", task: "H&H Ch 5: digital building blocks — adders, ALUs, shifters, comparators", book: "H&H", side: "Code a parameterized ALU in SV" },
      { id: "w7d2", day: "Tue", task: "H&H Ch 6: architecture — MIPS ISA, instruction encoding, datapath", book: "H&H", side: "Connects to your gem5 branch predictor" },
      { id: "w7d3", day: "Wed", task: "H&H Ch 7: microarchitecture — single cycle, multicycle, pipelining, hazards", book: "H&H", side: "Draw pipeline diagram + forwarding paths" },
      { id: "w7d4", day: "Thu", task: "STA: setup time, hold time, slack, critical path, CDC, metastability", book: "H&H", side: "Derive setup/hold from 106→242 MHz work" },
      { id: "w7d5", day: "Fri", task: "Clock domain crossing: 2FF synchronizer, FIFO-based CDC, metastability", book: "H&H", side: "Most Intel/Qualcomm RTL roles test this hard" },
      { id: "w7d6", day: "Sat", task: "Code: 5-stage pipelined datapath in SV with forwarding unit", book: "PR", side: "Shows masters-level depth on resume", resumeLink: "Pipelining/retiming here is the exact technique behind your MAX10 106→242 MHz timing optimization bullet" },
      { id: "w7d7", day: "Sun", task: "Mock interview: RTL coding — implement priority arbiter, FIFO, gray counter", book: "Review", side: "Time yourself: 20 min per problem" }
    ]
  },
  {
    week: 8,
    title: "Project defense — SRAM, gem5 & architecture",
    subtitle: "No book chapters — your own project reports + targeted concept refreshers",
    phase: "Phase 5 — Defending the non-SV resume projects",
    days: [
      { id: "w8d1", day: "Mon", task: "Re-read your own 6T SRAM report end-to-end: cell ratios, read/write margins, why destructive read happens", book: "PD", side: "Be able to derive cell ratio tradeoff on a whiteboard" },
      { id: "w8d2", day: "Tue", task: "SRAM deep dive: DRC vs LVS (what each actually checks), why 0.15–0.28ns delay matters, PVS sign-off flow", book: "PD", side: "Explain DRC/LVS difference in 30 seconds, cold" },
      { id: "w8d3", day: "Wed", task: "Re-read your gem5 report: Bimodal vs GShare predictor logic, what Global History Register actually does", book: "PD", side: "Draw GShare XOR-with-PC diagram from memory" },
      { id: "w8d4", day: "Thu", task: "gem5 deep dive: IPC vs MPKI — what each measures, why GHR length causes aliasing, how you'd reduce it", book: "PD", side: "Explain aliasing tradeoff like you're teaching it" },
      { id: "w8d5", day: "Fri", task: "Cross-link session: how SRAM (memory) and branch predictors (control flow) both trace back to your RTL/timing skills", book: "PD", side: "Write 3 sentences connecting all 5 resume projects into one coherent narrative" },
      { id: "w8d6", day: "Sat", task: "Mock Q&A: 15 rapid-fire questions on SRAM + gem5 only, answer out loud, no notes", book: "PD", side: "If you hesitate >10s on any, that's tonight's flashcard", resumeLink: "Directly defends 4×4 6T SRAM project and gem5 Custom Branch Predictor — the only two resume bullets outside your SV book stack" },
      { id: "w8d7", day: "Sun", task: "Light review day: skim Forbes Marshall internship bullets (PID tuning, UART/I2C/SPI) so analog/embedded story is fresh too", book: "Review", side: "Rest — this week was dense" }
    ]
  },
  {
    week: 9,
    title: "Full interview simulation week",
    subtitle: "No new reading — only drilling and mock interviews",
    phase: "Phase 4 — Computer arch + timing + interview prep",
    days: [
      { id: "w9d1", day: "Mon", task: "Project deep-dive: explain every resume project in full technical detail", book: "Review", side: "UVM TB, 1D Conv Accel, SRAM, gem5" },
      { id: "w9d2", day: "Tue", task: "RTL coding drill: write 5 modules — mux, encoder, synchronizer, FIFO, FSM", book: "PR", side: "Handwritten on paper first, then simulate" },
      { id: "w9d3", day: "Wed", task: "DV drill: write UVM driver + scoreboard for simple DUT in 90 min", book: "PR", side: "Timed, no reference" },
      { id: "w9d4", day: "Thu", task: "Timing + arch: 15 rapid-fire STA questions, pipeline hazard problems", book: "PR", side: "ChipVerify + VLSI Universe question banks" },
      { id: "w9d5", day: "Fri", task: "Full mock technical interview: 1hr RTL + 1hr DV questions", book: "PR", side: "Record and review your explanations" },
      { id: "w9d6", day: "Sat", task: "Behavioral + project stories: STAR format for every resume bullet", book: "Review", side: "Especially the 100% coverage closure story" },
      { id: "w9d7", day: "Sun", task: "Rest. Review your weakest topic only. You are ready.", book: "Review", side: "Confidence is built, not found" }
    ]
  }
];

export const BOOK_COLORS = {
  "H&H": { bg: "#1a1400", border: "#ffd700", text: "#ffd700" },
  "SV-D": { bg: "#0d0a1f", border: "#7c4dff", text: "#b39ddb" },
  "SV-V": { bg: "#001a14", border: "#00e5cc", text: "#80cbc4" },
  TB: { bg: "#1a0a00", border: "#ff6d00", text: "#ffb74d" },
  PR: { bg: "#001a00", border: "#00e676", text: "#69f0ae" },
  PD: { bg: "#1a001a", border: "#e040fb", text: "#ea80fc" },
  Review: { bg: "#0d0d1a", border: "#4fc3f7", text: "#81d4fa" },
};
