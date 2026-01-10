// import { useState } from 'react';
// Icons are available via material font in index.html, but I can use lucide for some if needed, 
// but design uses material symbols. I will use material symbols to match design 1:1.

export default function StrategyEditor() {
    // Mock code removed

    // Simple tokenization for demo purposes to match the design's syntax highlighting
    // In a real app, use Monaco Editor or Prism
    const renderCode = () => {
        // This is hardcoded to match the visual provided in the prompt exactly for the demo
        return (
            <pre><code>
                <span className="token-keyword">import</span> algotester.api <span className="token-keyword">as</span> algo{"\n"}
                <span className="token-keyword">from</span> indicators <span className="token-keyword">import</span> SMA, RSI{"\n\n"}
                <span className="token-keyword">class</span> <span className="token-function">ScavengerV2</span>(algo.Strategy):{"\n"}
                {"    "}<span className="token-comment"># Define parameters for optimization</span>{"\n"}
                {"    "}params = {"{"}{"\n"}
                {"        "}<span className="token-string">'fast_period'</span>: <span className="token-number">14</span>,{"\n"}
                {"        "}<span className="token-string">'slow_period'</span>: <span className="token-number">50</span>,{"\n"}
                {"        "}<span className="token-string">'rsi_period'</span>: <span className="token-number">14</span>,{"\n"}
                {"        "}<span className="token-string">'rsi_overbought'</span>: <span className="token-number">70</span>,{"\n"}
                {"        "}<span className="token-string">'rsi_oversold'</span>: <span className="token-number">30</span>{"\n"}
                {"    "}{"}"}{"\n\n"}
                {"    "}<span className="token-keyword">def</span> <span className="token-function">initialize</span>(<span className="token-keyword">self</span>):{"\n"}
                {"        "}<span className="token-keyword">self</span>.fast_ma = <span className="token-function">SMA</span>(<span className="token-keyword">self</span>.data.close, <span className="token-keyword">self</span>.params[<span className="token-string">'fast_period'</span>]){"\n"}
                {"        "}<span className="token-keyword">self</span>.slow_ma = <span className="token-function">SMA</span>(<span className="token-keyword">self</span>.data.close, <span className="token-keyword">self</span>.params[<span className="token-string">'slow_period'</span>]){"\n"}
                {"        "}<span className="token-keyword">self</span>.rsi = <span className="token-function">RSI</span>(<span className="token-keyword">self</span>.data.close, <span className="token-keyword">self</span>.params[<span className="token-string">'rsi_period'</span>]){"\n\n"}
                {"    "}<span className="token-keyword">def</span> <span className="token-function">on_bar</span>(<span className="token-keyword">self</span>):{"\n"}
                {"        "}<span className="token-comment"># Entry Logic: Crossover + RSI Condition</span>{"\n"}
                {"        "}<span className="token-control">if</span> <span className="token-keyword">self</span>.fast_ma[-1] &gt; <span className="token-keyword">self</span>.slow_ma[-1] <span className="token-control">and</span> <span className="token-keyword">self</span>.rsi[-1] &lt; <span className="token-keyword">self</span>.params[<span className="token-string">'rsi_oversold'</span>]:{"\n"}
                {"            "}<span className="token-control">if</span> <span className="token-keyword">not</span> <span className="token-keyword">self</span>.position:{"\n"}
                {"                "}<span className="token-keyword">self</span>.<span className="token-function">buy</span>(size=<span className="token-number">1.0</span>){"\n"}
                {"                "}<span className="token-function">print</span>(<span className="token-string">f"Opened Long at {"{self.data.close[-1]}"}"</span>){"\n\n"}
                {"        "}<span className="token-comment"># Exit Logic</span>{"\n"}
                {"        "}<span className="token-control">elif</span> <span className="token-keyword">self</span>.fast_ma[-1] &lt; <span className="token-keyword">self</span>.slow_ma[-1] <span className="token-control">or</span> <span className="token-keyword">self</span>.rsi[-1] &gt; <span className="token-keyword">self</span>.params[<span className="token-string">'rsi_overbought'</span>]:{"\n"}
                {"            "}<span className="token-control">if</span> <span className="token-keyword">self</span>.position.is_long:{"\n"}
                {"                "}<span className="token-keyword">self</span>.<span className="token-function">close</span>(){"\n"}
            </code></pre>
        );
    };

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark min-w-0 overflow-hidden">
            {/* Header */}
            <header className="bg-surface-darker border-b border-border-dark px-6 py-4 flex flex-col gap-4 sticky top-0 z-20 shrink-0">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Strategy Editor</h2>
                        <p className="text-slate-400 text-sm mt-1">Design and optimize your algorithmic trading rules</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center justify-center h-10 w-10 rounded-lg border border-border-dark text-slate-400 hover:text-white hover:bg-white/5">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="flex items-center justify-center h-10 w-10 rounded-lg border border-border-dark text-slate-400 hover:text-white hover:bg-white/5">
                            <span className="material-symbols-outlined">help</span>
                        </button>
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row items-end lg:items-center gap-4 w-full">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Strategy Name</span>
                            <div className="relative">
                                <select className="w-full appearance-none rounded-lg border border-border-dark bg-[#1c1f27] py-2.5 px-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer">
                                    <option>BTCUSD Scavenger V2</option>
                                    <option>ETH Trend Follower</option>
                                    <option>New Strategy...</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-500 pointer-events-none text-lg">expand_more</span>
                            </div>
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Timeframe</span>
                            <div className="relative">
                                <select className="w-full appearance-none rounded-lg border border-border-dark bg-[#1c1f27] py-2.5 px-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer">
                                    <option>1 Hour (H1)</option>
                                    <option>15 Minute (M15)</option>
                                    <option>4 Hour (H4)</option>
                                    <option>Daily (D1)</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-500 pointer-events-none text-lg">expand_more</span>
                            </div>
                        </label>
                    </div>
                    <div className="flex items-center gap-3 mt-4 lg:mt-0">
                        <button className="flex items-center justify-center gap-2 bg-surface-dark hover:bg-white/5 border border-border-dark text-white font-medium text-sm h-[42px] px-5 rounded-lg transition-colors whitespace-nowrap">
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            Save Strategy
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-semibold text-sm h-[42px] px-6 rounded-lg transition-colors shadow-lg shadow-primary/20 whitespace-nowrap">
                            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                            Run Backtest
                        </button>
                    </div>
                </div>
            </header>

            {/* Editor Layout */}
            <div className="flex-1 overflow-hidden p-4 lg:p-6 flex flex-col lg:flex-row gap-6 h-full">
                {/* Sidebar */}
                <div className="w-full lg:w-72 flex flex-col bg-surface-dark border border-border-dark rounded-xl overflow-hidden shrink-0 shadow-sm h-full max-h-[400px] lg:max-h-full">
                    <div className="p-4 border-b border-border-dark bg-surface-darker">
                        <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-3">Indicator Library</h3>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-lg">search</span>
                            <input
                                className="w-full bg-[#1c1f27] border border-border-dark rounded-md py-2 pl-9 pr-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                placeholder="Search indicators..."
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {/* Trend Section */}
                        <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase mt-2">Trend</div>
                        <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors group">
                            <span className="material-symbols-outlined text-slate-500 group-hover:text-primary text-[20px]">ssid_chart</span>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">Moving Average</span>
                                <span className="text-[10px] text-slate-500">SMA, EMA, WMA</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-600 ml-auto text-lg opacity-0 group-hover:opacity-100">add_circle</span>
                        </button>
                        <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors group">
                            <span className="material-symbols-outlined text-slate-500 group-hover:text-primary text-[20px]">stacked_line_chart</span>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">Bollinger Bands</span>
                                <span className="text-[10px] text-slate-500">Volatility measure</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-600 ml-auto text-lg opacity-0 group-hover:opacity-100">add_circle</span>
                        </button>
                        <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors group">
                            <span className="material-symbols-outlined text-slate-500 group-hover:text-primary text-[20px]">show_chart</span>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">MACD</span>
                                <span className="text-[10px] text-slate-500">Momentum osc</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-600 ml-auto text-lg opacity-0 group-hover:opacity-100">add_circle</span>
                        </button>

                        {/* Oscillators Section */}
                        <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase mt-2">Oscillators</div>
                        <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors group">
                            <span className="material-symbols-outlined text-slate-500 group-hover:text-purple-400 text-[20px]">water_ec</span>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">RSI</span>
                                <span className="text-[10px] text-slate-500">Relative Strength</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-600 ml-auto text-lg opacity-0 group-hover:opacity-100">add_circle</span>
                        </button>
                        <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors group">
                            <span className="material-symbols-outlined text-slate-500 group-hover:text-purple-400 text-[20px]">query_stats</span>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">Stochastic</span>
                                <span className="text-[10px] text-slate-500">Momentum indicator</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-600 ml-auto text-lg opacity-0 group-hover:opacity-100">add_circle</span>
                        </button>

                        {/* Volume Section */}
                        <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase mt-2">Volume</div>
                        <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors group">
                            <span className="material-symbols-outlined text-slate-500 group-hover:text-orange-400 text-[20px]">bar_chart</span>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">On-Balance Vol</span>
                                <span className="text-[10px] text-slate-500">OBV</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-600 ml-auto text-lg opacity-0 group-hover:opacity-100">add_circle</span>
                        </button>
                    </div>
                </div>

                {/* Code Editor */}
                <div className="flex-1 flex flex-col bg-editor-bg border border-border-dark rounded-xl overflow-hidden shadow-sm h-full max-h-[600px] lg:max-h-full">
                    {/* Tabs */}
                    <div className="flex items-center bg-surface-darker border-b border-border-dark overflow-x-auto">
                        <div className="flex items-center gap-2 px-4 py-3 bg-editor-bg border-t-2 border-primary text-white text-sm font-medium min-w-[140px]">
                            <span className="material-symbols-outlined text-blue-400 text-[16px]">code</span>
                            strategy_logic.py
                            <span className="material-symbols-outlined text-[14px] ml-auto hover:text-white text-slate-500 cursor-pointer">close</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 text-sm font-medium min-w-[140px] cursor-pointer border-r border-border-dark/50">
                            <span className="material-symbols-outlined text-yellow-400 text-[16px]">settings</span>
                            config.json
                        </div>
                        <div className="flex-1"></div>
                        <div className="px-3 flex items-center gap-2">
                            <span className="text-xs text-slate-500">Ln 14, Col 32</span>
                            <span className="text-xs text-slate-500">UTF-8</span>
                        </div>
                    </div>

                    {/* Code Area */}
                    <div className="flex-1 relative overflow-auto font-mono text-sm leading-6">
                        <div className="flex min-h-full">
                            <div className="w-12 bg-surface-darker text-slate-600 text-right pr-3 pt-4 select-none border-r border-border-dark/30">
                                {Array.from({ length: 23 }, (_, i) => i + 1).map(line => (
                                    <div key={line}>{line}</div>
                                ))}
                            </div>
                            <div className="flex-1 p-4 text-[#d4d4d4]">
                                {renderCode()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
