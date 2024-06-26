import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Icon } from 'apps/web/src/components/Icon/Icon';
import Input from 'apps/web/src/components/Input';
import { useFocusWithin } from 'apps/web/src/utils/hooks/useFocusWithin';
import { useIsNameAvailable } from 'apps/web/src/utils/hooks/useIsNameAvailable';
import {
  USERNAME_MAX_CHARACTER_LENGTH,
  USERNAME_MIN_CHARACTER_LENGTH,
  formatBaseEthDomain,
} from 'apps/web/src/utils/usernames';
import classNames from 'classnames';
import {
  FocusEventHandler,
  MouseEventHandler,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDebounceValue } from 'usehooks-ts';

export enum UsernameSearchInputVariant {
  Small,
  Large,
}

type UsernameSearchInputProps = {
  selectName: (name: string) => void;
  variant: UsernameSearchInputVariant;
  placeholder: string;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onMouseEnter?: MouseEventHandler<HTMLFieldSetElement>;
  onMouseLeave?: MouseEventHandler<HTMLFieldSetElement>;
};

export function UsernameSearchInput({
  selectName,
  variant,
  placeholder,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
}: UsernameSearchInputProps) {
  const { ref, focused } = useFocusWithin();
  const [search, setSearch] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [debouncedSearch] = useDebounceValue(search, 200);
  const { isLoading, data, isError, isFetching } = useIsNameAvailable(debouncedSearch);
  const validSearch =
    debouncedSearch.length >= USERNAME_MIN_CHARACTER_LENGTH &&
    debouncedSearch.length <= USERNAME_MAX_CHARACTER_LENGTH;

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearch(value);
  }, []);

  const setSearchFromSuggestion = useCallback((suggestion: string) => {
    setSearch(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setDropdownOpen(validSearch);
  }, [debouncedSearch, validSearch]);

  const usernameSearchInputClasses = classNames(
    'relative z-10 transition-all duration-500 w-full mx-auto group text-black',
  );

  // This will change/animate the border when hovering the whole component
  const groupBorderClasses = classNames('transition-colors', {
    'border-2 border-line/20 group-hover:border-blue-600 ':
      variant === UsernameSearchInputVariant.Large,
    'border border-transparent group-hover:border-line/20 ':
      variant === UsernameSearchInputVariant.Small,

    'shadow-lg': variant === UsernameSearchInputVariant.Large,
  });

  const inputClasses = classNames(
    'w-full outline-0 placeholder:uppercase peer ',
    // Padding & Font sizes
    {
      'py-7 pl-6 pr-16 text-2xl': variant === UsernameSearchInputVariant.Large,
      'py-2 pl-3 pr-6': variant === UsernameSearchInputVariant.Small,
    },
    // Background
    {
      'bg-white': variant === UsernameSearchInputVariant.Large,
      'bg-transparent focus:bg-white': variant === UsernameSearchInputVariant.Small,
    },
    // border colors
    {
      'border-line/20 focus:border-blue-600 ': variant === UsernameSearchInputVariant.Large,
      'focus:border-line/20 hover:border-line/20': variant === UsernameSearchInputVariant.Small,
    },
    // Borders Radius
    {
      'rounded-3xl': variant === UsernameSearchInputVariant.Large,
      'rounded-xl': variant === UsernameSearchInputVariant.Small,
      'rounded-b-none border-b-none border-b-0': dropdownOpen,
    },
    groupBorderClasses,
  );

  const dropdownClasses = classNames(
    'flex flex-col items-start bg-white text-black',
    'absolute left-0 right-0 top-full z-10 border-t-0 ',
    groupBorderClasses,
    // radius, Padding & Font sizes
    {
      'pb-4 rounded-b-3xl': variant === UsernameSearchInputVariant.Large,
      'pb-2 rounded-b-xl': variant === UsernameSearchInputVariant.Small,
    },
    // border colors
    {
      'border-2 peer-focus:border-blue-600': variant === UsernameSearchInputVariant.Large,
      'border peer-focus:border-line/20': variant === UsernameSearchInputVariant.Small,
    },
    // Visible or not
    {
      'opacity-0': !dropdownOpen,
      'opacity-1': dropdownOpen,
    },

    // // Animation
    'transition-all overflow-scroll ',
    {
      'max-h-[20rem]': dropdownOpen,
      'max-h-0 p-0 overflow-hidden border-none': !dropdownOpen,
    },
  );

  const dropdownLabelClasses = classNames('w-full uppercase text-[#5B616E] font-bold', {
    'px-6 text-sm mb-4 mt-4': variant === UsernameSearchInputVariant.Large,
    'px-3 text-xs mb-2 mt-2': variant === UsernameSearchInputVariant.Small,
  });

  const buttonClasses = classNames(
    'flex w-full flex-row items-center justify-between transition-colors hover:bg-[#F9F9F9] active:bg-[#EAEAEB] text-ellipsis',
    {
      'px-6 py-4 text': variant === UsernameSearchInputVariant.Large,
      'px-3 py-2 text-sm': variant === UsernameSearchInputVariant.Small,
    },
  );

  const searchIconClasses = classNames(
    'pointer-events-none absolute top-1/2 z-20 flex -translate-y-1/2 items-center',
    {
      'right-8': variant === UsernameSearchInputVariant.Large,
      'right-3': variant === UsernameSearchInputVariant.Small,
    },
  );

  const lineClasses = classNames('w-full', {
    'px-6': variant === UsernameSearchInputVariant.Large,
    'px-3': variant === UsernameSearchInputVariant.Small,
  });

  const mutedMessage = classNames('text-muted ', {
    'px-6 py-4 text': variant === UsernameSearchInputVariant.Large,
    'px-3 py-2 text-sm': variant === UsernameSearchInputVariant.Small,
  });

  const spinnerWrapperClasses = classNames('flex  w-full items-center justify-center', {
    // Equivalent to the dropdown when one name is available
    'h-[6.75rem]': variant === UsernameSearchInputVariant.Large,
    'h-[4.25rem]': variant === UsernameSearchInputVariant.Small,
  });

  const iconSize = variant === UsernameSearchInputVariant.Large ? 24 : 16;

  const inputId = useId();

  function handleSelectName(name: string) {
    setDropdownOpen(false);
    selectName(name);
  }

  useEffect(() => {
    if (!focused) {
      setDropdownOpen(false);
      return;
    }

    if (focused && validSearch) {
      setDropdownOpen(true);
    }
  }, [focused, validSearch]);

  // TODO: Smarter suggestions (openai api?)
  // Right now david.base.eth is taken, it'll suggest david1.base.eth but
  // ultimately that might also be taken.
  const suggestions: string[] = useMemo(() => {
    return [`${debouncedSearch}1`, `${debouncedSearch}2`, `${debouncedSearch}3`];
  }, [debouncedSearch]);

  return (
    <fieldset
      className={usernameSearchInputClasses}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={ref}
    >
      <Input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder={placeholder}
        className={inputClasses}
        onFocus={onFocus}
        onBlur={onBlur}
        id={inputId}
        ref={inputRef}
      />
      <div className={dropdownClasses}>
        <div className={lineClasses}>
          <div className="w-full border-t border-line/20 " />
        </div>
        {data === true ? (
          <>
            <p className={dropdownLabelClasses}>Available</p>
            <button
              className={buttonClasses}
              type="button"
              onClick={() => handleSelectName(debouncedSearch)}
            >
              <span className="truncate">{formatBaseEthDomain(debouncedSearch)}</span>
              <ChevronRightIcon width={iconSize} height={iconSize} />
            </button>
          </>
        ) : isLoading || isFetching ? (
          <div className={spinnerWrapperClasses}>
            <Icon name="spinner" color="currentColor" />
          </div>
        ) : isError ? (
          <p className={mutedMessage}>There was an error fetching the data</p>
        ) : (
          <>
            <p className={mutedMessage}>{formatBaseEthDomain(debouncedSearch)} is not available</p>
            <p className={dropdownLabelClasses}>Suggestion</p>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                className={buttonClasses}
                type="button"
                onClick={() => setSearchFromSuggestion(suggestion)}
              >
                <span className="truncate">{formatBaseEthDomain(suggestion)}</span>
                <Icon name="chevronRight" width={iconSize} height={iconSize} />
              </button>
            ))}
          </>
        )}
      </div>
      <span className={searchIconClasses}>
        <Icon name="search" color="currentColor" height={iconSize} width={iconSize} />
      </span>
    </fieldset>
  );
}
