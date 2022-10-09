import { MultiBar, Presets } from 'cli-progress';

type Progress = {
  total: number;
  index: string;
  title: string;
  category: string;
  status?: string;
};

export function composeProgress() {
  const progress = new MultiBar(
    {
      format: `{emoji} {index}. | {bar} | {category} > {title} | {status}`,
      hideCursor: true,
    },
    Presets.rect,
  );

  return {
    create: ({
      total,
      index,
      title,
      category,
      status = 'Waiting...',
    }: Progress) =>
      progress.create(total, 0, {
        emoji: '⏳',
        index,
        category,
        title,
        status,
      }),
    stop: () => progress.stop(),
  };
}
