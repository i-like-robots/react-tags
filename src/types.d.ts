declare namespace ReactTags {
  interface Tag {
    name: string,
    id?: string|number,
    disabled?: boolean
  }

  interface ClassNames {
    root: string,
    rootFocused: string,
    selected: string,
    selectedTag: string,
    selectedTagName: string,
    search: string,
    searchInput: string,
    suggestions: string,
    suggestionActive: string,
    suggestionDisabled: string
  }

  interface AdditionCallback {
    (tag: Tag): any
  }

  interface DeleteCallback {
    (index: number): any
  }

  interface InputCallback {
    (input: string): any
  }
}
