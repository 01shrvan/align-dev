import type { ComponentProps, FC } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  AiBrain01Icon,
  ArrowDown01Icon,
  ArrowDownLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  AtIcon,
  Bookmark01Icon,
  Briefcase01Icon,
  BubbleChatIcon,
  Camera01Icon,
  Cancel01Icon,
  ChatBotIcon,
  CheckmarkBadge01Icon,
  CircleIcon as CircleSvgIcon,
  Clock01Icon,
  Compass01Icon,
  Delete02Icon,
  Download01Icon,
  FavouriteIcon,
  FilterIcon,
  Home01Icon,
  Image01Icon,
  Link01Icon,
  Loading03Icon,
  LockIcon,
  Logout01Icon,
  Mail01Icon,
  MapPinIcon,
  Message01Icon,
  MoreHorizontalIcon,
  News01Icon,
  Notification01Icon,
  Search01Icon,
  SentIcon,
  Shield01Icon,
  SparklesIcon,
  Tick01Icon,
  User02Icon,
  UserGroupIcon,
  UserIcon as UserSvgIcon,
  ViewIcon,
  ViewOffIcon,
  ZapIcon,
} from "@hugeicons/core-free-icons";

type LucideProps = Omit<ComponentProps<typeof HugeiconsIcon>, "icon">;

function createIcon(icon: ComponentProps<typeof HugeiconsIcon>["icon"]): FC<LucideProps> {
  const IconComponent: FC<LucideProps> = ({
    color,
    strokeWidth = 1.75,
    size = 24,
    ...props
  }) => (
    <HugeiconsIcon
      icon={icon}
      color={color ?? "currentColor"}
      size={size}
      strokeWidth={strokeWidth}
      {...props}
    />
  );

  return IconComponent;
}

export const X = createIcon(Cancel01Icon);
export const XIcon = X;
export const Download = createIcon(Download01Icon);
export const ArrowRight = createIcon(ArrowRight01Icon);
export const Compass = createIcon(Compass01Icon);
export const MessageSquare = createIcon(Message01Icon);
export const Sparkles = createIcon(SparklesIcon);
export const Bell = createIcon(Notification01Icon);
export const Bookmark = createIcon(Bookmark01Icon);
export const Home = createIcon(Home01Icon);
export const Briefcase = createIcon(Briefcase01Icon);
export const MessageCircle = createIcon(BubbleChatIcon);
export const Users = createIcon(UserGroupIcon);
export const User = createIcon(UserSvgIcon);
export const UserIcon = User;
export const User2 = createIcon(User02Icon);
export const LogOutIcon = createIcon(Logout01Icon);
export const Loader2 = createIcon(Loading03Icon);
export const Clock = createIcon(Clock01Icon);
export const Zap = createIcon(ZapIcon);
export const Brain = createIcon(AiBrain01Icon);
export const Search = createIcon(Search01Icon);
export const SearchIcon = Search;
export const CornerDownLeft = createIcon(ArrowDownLeft01Icon);
export const MoreHorizontal = createIcon(MoreHorizontalIcon);
export const Trash2 = createIcon(Delete02Icon);
export const Ghost = createIcon(ChatBotIcon);
export const Heart = createIcon(FavouriteIcon);
export const AtSign = createIcon(AtIcon);
export const Send = createIcon(SentIcon);
export const SendHorizonal = Send;
export const ImageIcon = createIcon(Image01Icon);
export const Plus = createIcon(Add01Icon);
export const Filter = createIcon(FilterIcon);
export const Mail = createIcon(Mail01Icon);
export const ExternalLink = createIcon(Link01Icon);
export const MapPin = createIcon(MapPinIcon);
export const CheckIcon = createIcon(Tick01Icon);
export const ChevronDownIcon = createIcon(ArrowDown01Icon);
export const ChevronUpIcon = createIcon(ArrowUp01Icon);
export const ChevronRightIcon = createIcon(ArrowRight01Icon);
export const CircleIcon = createIcon(CircleSvgIcon);
export const Eye = createIcon(ViewIcon);
export const EyeOff = createIcon(ViewOffIcon);
export const BadgeCheck = createIcon(CheckmarkBadge01Icon);
export const Newspaper = createIcon(News01Icon);
export const Lock = createIcon(LockIcon);
export const Shield = createIcon(Shield01Icon);
export const Camera = createIcon(Camera01Icon);
