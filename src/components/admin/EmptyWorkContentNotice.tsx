export function EmptyWorkContentNotice() {
  return (
    <div className="border border-dashed border-muted-foreground/30 rounded-lg p-6 text-center bg-muted/20">
      <p className="text-sm font-semibold text-foreground mb-2">
        아직 생성된 콘텐츠가 없어요
      </p>
      <p className="text-xs text-muted-foreground leading-relaxed">
        워크가 진행되면<br />
        키워드, 콘텐츠, 완료 정보가 이곳에 표시됩니다.
      </p>
    </div>
  );
}