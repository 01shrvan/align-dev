import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { getGlobalInterests } from "@/app/onboarding/actions";
import CropImageDialog from "@/components/CropImageDialog";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserData } from "@/lib/types";
import { Camera, CheckIcon, Plus, SearchIcon, X } from "@/lib/icons";
import { cn } from "@/lib/utils";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Image, { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Resizer from "react-image-file-resizer";
import { useUpdateProfileMutation } from "./mutations";

const INTERESTS = [
  "Content Creation",
  "Video Editing",
  "Photography",
  "Graphic Design",
  "Animation",
  "Music Production",
  "Web Development",
  "App Development",
  "AI/ML",
  "Gaming",
  "Streaming",
  "Podcasting",
  "Writing",
  "Fitness",
  "Fashion",
  "Cooking",
  "Travel",
  "Tech",
  "Art",
  "Film Making",
  "3D Modeling",
  "UI/UX Design",
  "Startups",
  "Crypto/Web3",
  "E-commerce",
  "Social Media",
  "Marketing",
  "Teaching",
];

const MIN_INTERESTS = 3;
const MAX_INTERESTS = 5;

function normalizeInterest(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function formatInterest(value: string) {
  return value
    .split(" ")
    .map((word) => {
      if (!word) {
        return word;
      }

      if (word === word.toUpperCase()) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function dedupeInterests(values: string[]) {
  const map = new Map<string, string>();

  values.forEach((value) => {
    const normalized = normalizeInterest(value);
    if (!normalized) {
      return;
    }

    const key = normalized.toLowerCase();
    if (!map.has(key)) {
      map.set(key, formatInterest(normalized));
    }
  });

  return Array.from(map.values());
}

function parseBioSections(bio: string | null) {
  if (!bio) {
    return {
      story: "",
      creating: "",
      why: "",
    };
  }

  const sections = bio.split("\n\n").filter((section) => section.trim());

  if (sections.length === 3) {
    return {
      story: sections[0].trim(),
      creating: sections[1].trim(),
      why: sections[2].trim(),
    };
  }

  return {
    story: bio,
    creating: "",
    why: "",
  };
}

interface EditProfileDialogProps {
  user: UserData & { interests: string[] };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileDialog({
  user,
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  const parsedBio = parseBioSections(user.bio);
  const form = useForm<UpdateUserProfileValues>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      displayName: user.displayName,
      story: parsedBio.story,
      creating: parsedBio.creating,
      why: parsedBio.why,
      interests: dedupeInterests(user.interests || []).slice(0, MAX_INTERESTS),
    },
  });

  const mutation = useUpdateProfileMutation();

  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);
  const [availableInterests, setAvailableInterests] = useState<string[]>(() =>
    dedupeInterests([...INTERESTS, ...(user.interests || [])]),
  );
  const [interestInput, setInterestInput] = useState("");

  const selectedInterests = form.watch("interests") || [];

  useEffect(() => {
    async function fetchInterests() {
      try {
        const globalInterests = await getGlobalInterests();
        if (globalInterests.length > 0) {
          setAvailableInterests((prev) =>
            dedupeInterests([...prev, ...globalInterests]),
          );
        }
      } catch {
        return;
      }
    }

    if (open) {
      fetchInterests();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      const bioSections = parseBioSections(user.bio);
      form.reset({
        displayName: user.displayName,
        story: bioSections.story,
        creating: bioSections.creating,
        why: bioSections.why,
        interests: dedupeInterests(user.interests || []).slice(0, MAX_INTERESTS),
      });
      setInterestInput("");
      setCroppedAvatar(null);
    }
  }, [form, open, user.bio, user.displayName, user.interests]);

  const normalizedInput = normalizeInterest(interestInput);
  const lowerInput = normalizedInput.toLowerCase();

  const exactMatch = availableInterests.find(
    (interest) => interest.toLowerCase() === lowerInput,
  );

  const unselectedInterests = availableInterests.filter(
    (interest) => !selectedInterests.includes(interest),
  );

  const filteredUnselectedInterests = lowerInput
    ? unselectedInterests.filter((interest) =>
      interest.toLowerCase().includes(lowerInput),
    )
    : unselectedInterests;

  function setInterests(values: string[]) {
    form.setValue("interests", values, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
  }

  function toggleInterest(interest: string) {
    if (selectedInterests.includes(interest)) {
      setInterests(selectedInterests.filter((value) => value !== interest));
      return;
    }

    if (selectedInterests.length >= MAX_INTERESTS) {
      return;
    }

    setInterests([...selectedInterests, interest]);
  }

  function removeSelectedInterest(interest: string) {
    setInterests(selectedInterests.filter((value) => value !== interest));
  }

  function handleAddInterest() {
    if (!normalizedInput || selectedInterests.length >= MAX_INTERESTS) {
      return;
    }

    if (exactMatch) {
      if (!selectedInterests.includes(exactMatch)) {
        setInterests([...selectedInterests, exactMatch]);
      }
    } else {
      const newInterest = formatInterest(normalizedInput);
      setAvailableInterests((prev) => dedupeInterests([newInterest, ...prev]));
      setInterests(
        selectedInterests.includes(newInterest)
          ? selectedInterests
          : [...selectedInterests, newInterest],
      );
    }

    setInterestInput("");
  }

  async function onSubmit(values: UpdateUserProfileValues) {
    const newAvatarFile = croppedAvatar
      ? new File([croppedAvatar], `avatar_${user.id}.webp`)
      : undefined;

    mutation.mutate(
      {
        values,
        avatar: newAvatarFile,
      },
      {
        onSuccess: () => {
          setCroppedAvatar(null);
          setInterestInput("");
          onOpenChange(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label>Avatar</Label>
              <AvatarInput
                src={
                  croppedAvatar
                    ? URL.createObjectURL(croppedAvatar)
                    : user.avatarUrl || avatarPlaceholder
                }
                onImageCropped={setCroppedAvatar}
              />
            </div>
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your display name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="story"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Their Story</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="who are you? what drives you? what got you into creating?"
                      className="resize-none"
                      maxLength={500}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="creating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Creating</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="what kind of content do you make or want to make?"
                      className="resize-none"
                      maxLength={300}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="why"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Why It Matters</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="what impact do you want to have? why should people care?"
                      className="resize-none"
                      maxLength={300}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interests"
              render={() => (
                <FormItem className="space-y-3">
                  <FormLabel>Interests</FormLabel>
                  <div className="rounded-xl border border-border/70 bg-card/30 p-3">
                    {selectedInterests.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedInterests.map((interest) => (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => removeSelectedInterest(interest)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                          >
                            <span>{interest}</span>
                            <X className="h-3.5 w-3.5" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Pick at least {MIN_INTERESTS} interests.
                      </p>
                    )}
                  </div>

                  <div className="relative flex items-center gap-2">
                    <SearchIcon className="pointer-events-none absolute left-4 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search or add an interest"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddInterest();
                        }
                      }}
                      disabled={selectedInterests.length >= MAX_INTERESTS}
                      className="h-11 rounded-xl border-border/70 bg-card/40 pl-11 pr-14 sm:pr-24"
                    />
                    <Button
                      type="button"
                      onClick={handleAddInterest}
                      disabled={!normalizedInput || selectedInterests.length >= MAX_INTERESTS}
                      className="absolute right-1.5 h-8 rounded-lg px-2.5 text-xs sm:px-3"
                    >
                      <Plus className="h-3.5 w-3.5 sm:mr-1" />
                      <span className="hidden sm:inline">
                        {exactMatch ? "Select" : "Add"}
                      </span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {filteredUnselectedInterests.slice(0, 18).map((interest) => {
                      const isDisabled = selectedInterests.length >= MAX_INTERESTS;

                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={cn(
                            "group flex h-10 items-center justify-center gap-1.5 rounded-xl border px-2.5 text-sm font-medium transition-all",
                            "border-border/70 bg-background/60 text-foreground/90 hover:border-primary/40 hover:bg-card",
                            isDisabled && "cursor-not-allowed opacity-50",
                          )}
                          disabled={isDisabled}
                        >
                          <CheckIcon className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-70" />
                          <span className="truncate">{interest}</span>
                        </button>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton type="submit" loading={mutation.isPending}>
                Save
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface AvatarInputProps {
  src: string | StaticImageData;
  onImageCropped: (blob: Blob | null) => void;
}

function AvatarInput({ src, onImageCropped }: AvatarInputProps) {
  const [imageToCrop, setImageToCrop] = useState<File>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  function onImageSelected(image: File | undefined) {
    if (!image) return;

    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setImageToCrop(uri as File),
      "file",
    );
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelected(e.target.files?.[0])}
        ref={fileInputRef}
        className="sr-only hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative block"
      >
        <Image
          src={src}
          alt="Avatar preview"
          width={150}
          height={150}
          className="size-32 flex-none rounded-full object-cover"
        />
        <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-25">
          <Camera size={24} />
        </span>
      </button>
      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={1}
          onCropped={onImageCropped}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        />
      )}
    </>
  );
}
