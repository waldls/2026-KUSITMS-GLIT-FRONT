import Tag from "@/components/common/Tag";

interface Props {
  topDetailTags: string[];
}

const TopDetailTagsSection = ({ topDetailTags }: Props) => {
  const tags = topDetailTags.slice(0, 3);

  return (
    <div className="rounded-12 bg-gray-850 p-4">
      <div className="flex flex-col gap-2">
        <p className="body-3 text-center text-gray-100">다솔님의 TOP3 태그</p>
        <div className="flex flex-row justify-center gap-8">
          {tags.map(tag => (
            <Tag variant="gray" key={tag}>
              {tag}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopDetailTagsSection;
