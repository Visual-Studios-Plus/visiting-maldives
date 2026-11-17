/** Paragraphs of text; a blank line starts a new paragraph. */
export default function TextBlock({ body }: { body?: string }) {
  const paras = (body ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  if (!paras.length) return null;
  return (
    <div className="max-w-2xl space-y-4 text-[17px] leading-[28px]">
      {paras.map((p, i) => (
        <p key={i} className="whitespace-pre-line">{p}</p>
      ))}
    </div>
  );
}
