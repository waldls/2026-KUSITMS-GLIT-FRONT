"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import Header from "@/components/common/Header";
import TextArea from "@/components/common/TextArea";
import ChipGroup from "@/components/my/ChipGroup";
import { JOB_OPTIONS, STATUS_OPTIONS } from "@/constants/my";
import { NICKNAME_REGEX } from "@/constants/regex";
import { getNicknameError } from "@/lib/utils/validation";

type ProfileState = {
  nickname: string;
  jobRole: string;
  userStatus: string;
};

interface ProfileFormProps {
  initialProfile: ProfileState;
}

const ProfileForm = ({ initialProfile }: ProfileFormProps) => {
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileState>(initialProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(profile.nickname);
  const [jobRole, setJobRole] = useState(profile.jobRole);
  const [userStatus, setUserStatus] = useState(profile.userStatus);
  const [nicknameTouched, setNicknameTouched] = useState(false);

  const canSave = useMemo(
    () => NICKNAME_REGEX.test(nickname) && !!jobRole && !!userStatus,
    [nickname, jobRole, userStatus],
  );

  const handleEdit = () => {
    setNickname(profile.nickname);
    setJobRole(profile.jobRole);
    setUserStatus(profile.userStatus);
    setNicknameTouched(false);
    setIsEditing(true);
  };

  const handleSave = () => {
    // TODO: API 연동
    setProfile({ nickname, jobRole, userStatus });
    setIsEditing(false);
  };

  const handleBack = () => {
    if (isEditing) {
      setIsEditing(false);
      return;
    }
    router.back();
  };

  const nicknameError = nicknameTouched ? getNicknameError(nickname) : undefined;

  return (
    <div className="flex h-full w-full flex-col">
      <Header
        title="프로필 관리"
        onLeftClick={handleBack}
        rightLabel={isEditing ? "완료" : "편집"}
        rightLabelClassName={isEditing ? "text-sea-blue-400" : "text-gray-700"}
        onRightClick={isEditing ? handleSave : handleEdit}
        rightDisabled={isEditing && !canSave}
      />

      <div className="scrollbar-hide flex-1 overflow-y-auto px-5 pt-4">
        <p className="head-4 text-gray-100">기본 정보</p>
        <div className="flex flex-col gap-8 pt-5.5">
          <div className="flex flex-col gap-2">
            <p className="body-2 text-gray-300">닉네임</p>
            <TextArea
              value={isEditing ? nickname : profile.nickname}
              disabled={!isEditing}
              maxLength={12}
              className="h-9.75 p-2"
              textareaClassName="h-5.75"
              showCount={false}
              onChange={isEditing ? val => setNickname(val) : undefined}
              onBlur={isEditing ? () => setNicknameTouched(true) : undefined}
            />
            {isEditing && nicknameTouched && nicknameError && (
              <p className="body-4 text-error-primary">{nicknameError}</p>
            )}
          </div>

          <ChipGroup
            title="직군"
            options={JOB_OPTIONS}
            selectedValue={isEditing ? jobRole : profile.jobRole}
            isEditing={isEditing}
            onChange={setJobRole}
          />

          <ChipGroup
            title="현재 상태"
            options={STATUS_OPTIONS}
            selectedValue={isEditing ? userStatus : profile.userStatus}
            isEditing={isEditing}
            onChange={setUserStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
