$files = @(
  "app\admin-portal\page.js",
  "app\admin-portal\layout.js",
  "components\ui\alert-dialog.jsx",
  "components\ui\badge.jsx",
  "components\ui\button.jsx",
  "components\ui\card.jsx",
  "components\ui\dialog.jsx",
  "components\ui\input.jsx",
  "components\ui\tabs.jsx"
)

# Ordered (specific -> generic). Token boundary: not preceded by a word char, '-', '/', '[' (prefixes like hover: are allowed).
$rules = @(
  # arbitrary dark surfaces
  @('bg-\[#050706\]', 'bg-slate-100'),
  @('bg-\[#060a08\]', 'bg-slate-50'),
  @('bg-\[#060907\](/\d+)?', 'bg-slate-50'),
  @('bg-\[#0[0-9a-fA-F]{5}\](/\d+)?', 'bg-white'),
  @('bg-black/80', 'bg-slate-900/50'),
  @('bg-black/40', 'bg-slate-900/40'),
  @('bg-black(?![/\w-])', 'bg-slate-100'),
  # glow shadows -> subtle formal shadows
  @('shadow-\[[^\]]+\]', 'shadow-sm'),
  @('shadow-(emerald|rose)-\d+(/\d+)?', ''),
  # brand surfaces
  @('hover:bg-emerald-950/\d+', 'hover:bg-blue-50'),
  @('bg-emerald-950/\d+', 'bg-blue-50'),
  @('bg-emerald-500/\d+', 'bg-blue-50'),
  @('hover:bg-emerald-400', 'hover:bg-blue-700'),
  @('hover:bg-emerald-500', 'hover:bg-blue-600'),
  @('bg-emerald-500', 'bg-blue-600'),
  @('bg-emerald-400', 'bg-blue-500'),
  @('from-emerald-\d+', 'from-blue-600'),
  @('via-green-\d+', 'via-blue-500'),
  @('to-(green|emerald)-\d+', 'to-indigo-600'),
  @('hover:bg-zinc-(900|800)(/\d+)?', 'hover:bg-slate-100'),
  @('bg-zinc-900(/\d+)?', 'bg-slate-100'),
  @('bg-zinc-800', 'bg-slate-200'),
  # danger
  @('hover:bg-rose-950/\d+', 'hover:bg-rose-50'),
  @('hover:bg-rose-900', 'hover:bg-rose-100'),
  @('bg-rose-950/\d+', 'bg-rose-50'),
  @('hover:border-rose-\d+', 'hover:border-rose-300'),
  @('border-rose-\d+(/\d+)?', 'border-rose-200'),
  @('text-rose-(300|400)', 'text-rose-600'),
  # borders
  @('divide-emerald-950(/\d+)?', 'divide-slate-200'),
  @('border-emerald-950(/\d+)?', 'border-slate-200'),
  @('hover:border-emerald-500/\d+', 'hover:border-blue-300'),
  @('focus:border-emerald-500', 'focus:border-blue-500'),
  @('focus-visible:border-emerald-500', 'focus-visible:border-blue-500'),
  @('border-emerald-500/\d+', 'border-blue-200'),
  @('border-emerald-400', 'border-blue-500'),
  @('border-zinc-800(/\d+)?', 'border-slate-200'),
  @('border-zinc-700', 'border-slate-300'),
  @('ring-emerald-500/\d+', 'ring-blue-500/20'),
  @('ring-emerald-500', 'ring-blue-500'),
  # text (text-white must be mapped before text-black -> text-white)
  @('hover:text-white', 'hover:text-slate-900'),
  @('hover:text-black', 'hover:text-white'),
  @('hover:text-zinc-100', 'hover:text-slate-900'),
  @('hover:text-emerald-300', 'hover:text-blue-800'),
  @('text-white', 'text-slate-900'),
  @('text-black', 'text-white'),
  @('text-zinc-100', 'text-slate-900'),
  @('text-zinc-200', 'text-slate-800'),
  @('text-zinc-300', 'text-slate-700'),
  @('text-zinc-(400|500)', 'text-slate-500'),
  @('text-zinc-600', 'text-slate-400'),
  @('text-emerald-(300|400)', 'text-blue-700'),
  @('text-emerald-500', 'text-blue-600'),
  @('placeholder:text-zinc-\d+', 'placeholder:text-slate-400'),
  @('selection:bg-blue-600', 'selection:bg-blue-200'),
  @('selection:bg-emerald-500', 'selection:bg-blue-200'),
  @('selection:text-white', 'selection:text-slate-900'),
  @('selection:text-black', 'selection:text-slate-900'),
  @('backdrop-blur-xl', ''),
  @('rounded-\[26px\]', 'rounded-2xl')
)

foreach ($f in $files) {
  $text = [System.IO.File]::ReadAllText((Resolve-Path $f))
  foreach ($r in $rules) {
    $pattern = '(?<![\w/\[-])' + $r[0] + '(?![\w])'
    if ($r[0] -match '\(\?!') { $pattern = '(?<![\w/\[-])' + $r[0] }
    $text = [regex]::Replace($text, $pattern, $r[1])
  }
  [System.IO.File]::WriteAllText((Resolve-Path $f), $text)
  Write-Host "themed $f"
}
