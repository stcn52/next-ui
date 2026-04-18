type TranslateFn = (key: string, vars?: Record<string, string | number>) => string

function buildChatConversationsLabels(t: TranslateFn) {
  return {
    title: t("chatConversationTitle"),
    searchPlaceholder: t("chatConversationSearchPlaceholder"),
    openSearchAriaLabel: t("chatConversationOpenSearchAriaLabel"),
    closeSearchAriaLabel: t("chatConversationCloseSearchAriaLabel"),
    newChatAriaLabel: t("chatConversationNewChatAriaLabel"),
    groupAriaLabel: (group: string) => t("chatConversationGroupAriaLabel", { group }),
  }
}

function buildChatInputToolbarLabels(t: TranslateFn) {
  return {
    modelAriaLabel: t("chatInputModelAriaLabel"),
    temperatureAriaLabel: t("chatInputTemperatureAriaLabel"),
    voiceInputAriaLabel: t("chatInputVoiceInputAriaLabel"),
    quickCommandAriaLabel: t("chatInputQuickCommandAriaLabel"),
  }
}

function buildMessageActionsLabels(t: TranslateFn) {
  return {
    copyAriaLabel: t("chatMessageCopyAriaLabel"),
    thumbsUpAriaLabel: t("chatMessageThumbsUpAriaLabel"),
    thumbsDownAriaLabel: t("chatMessageThumbsDownAriaLabel"),
    moreActionsAriaLabel: t("chatMessageMoreActionsAriaLabel"),
    editLabel: t("chatMessageEditLabel"),
    regenerateLabel: t("chatMessageRegenerateLabel"),
  }
}

function buildChatBubbleLabels(t: TranslateFn) {
  return {
    thoughtChainToggleLabel: (count: number) => t("chatMessageThoughtChainToggleLabel", { count }),
    saveLabel: t("chatMessageSaveLabel"),
    cancelLabel: t("chatMessageCancelLabel"),
    copyAriaLabel: t("chatMessageCopyAriaLabel"),
    copyTooltip: t("chatMessageCopyTooltip"),
    thumbsUpAriaLabel: t("chatMessageThumbsUpAriaLabel"),
    thumbsUpTooltip: t("chatMessageThumbsUpTooltip"),
    thumbsDownAriaLabel: t("chatMessageThumbsDownAriaLabel"),
    thumbsDownTooltip: t("chatMessageThumbsDownTooltip"),
    moreActionsAriaLabel: t("chatMessageMoreActionsAriaLabel"),
    editLabel: t("chatMessageEditLabel"),
    regenerateLabel: t("chatMessageRegenerateLabel"),
  }
}

function buildChatCommandPaletteTexts(t: TranslateFn) {
  return {
    emptyText: t("chatCommandEmptyText"),
    searchPlaceholder: t("chatCommandSearchPlaceholder"),
    defaultGroupLabel: t("chatCommandDefaultGroupLabel"),
  }
}

function buildChatSenderLabels(t: TranslateFn) {
  return {
    placeholder: t("chatSenderPlaceholder"),
    dragOverlayText: t("chatSenderDragOverlayText"),
    applySuggestionAriaLabel: (suggestion: string) =>
      t("chatSenderApplySuggestionAriaLabel", { suggestion }),
    moreSuggestionsLabel: (count: number) => t("chatSenderMoreSuggestionsLabel", { count }),
    attachmentCountLabel: (count: number, compact: boolean) =>
      t(compact ? "chatSenderAttachmentCountCompactLabel" : "chatSenderAttachmentCountLabel", { count }),
    uploadingCountLabel: (count: number, compact: boolean) =>
      t(compact ? "chatSenderUploadingCountCompactLabel" : "chatSenderUploadingCountLabel", { count }),
    errorCountLabel: (count: number, compact: boolean) =>
      t(compact ? "chatSenderErrorCountCompactLabel" : "chatSenderErrorCountLabel", { count }),
    attachAriaLabel: t("chatSenderAttachAriaLabel"),
    suggestionsAriaLabel: t("chatSenderSuggestionsAriaLabel"),
    suggestionsPanelAriaLabel: t("chatSenderSuggestionsPanelAriaLabel"),
    mentionsAriaLabel: t("chatSenderMentionsAriaLabel"),
    uploadErrorText: t("chatSenderUploadErrorText"),
    retryLabel: t("chatSenderRetryLabel"),
    removeAttachmentAriaLabel: (name: string) => t("chatSenderRemoveAttachmentAriaLabel", { name }),
    hiddenAttachmentsAriaLabel: (count: number) => t("chatSenderHiddenAttachmentsAriaLabel", { count }),
    hiddenAttachmentsLabel: (count: number) => t("chatSenderHiddenAttachmentsLabel", { count }),
    stopAriaLabel: t("chatSenderStopAriaLabel"),
    stopLabel: t("chatSenderStopLabel"),
    sendAriaLabel: t("chatSenderSendAriaLabel"),
    keyboardHint: t("chatSenderKeyboardHint"),
  }
}

function buildChatPresenceLabels(t: TranslateFn) {
  return {
    online: t("chatPresenceOnline"),
    offline: t("chatPresenceOffline"),
    away: t("chatPresenceAway"),
    busy: t("chatPresenceBusy"),
    sent: t("chatPresenceSent"),
    delivered: t("chatPresenceDelivered"),
    read: t("chatPresenceRead"),
    typing: t("chatPresenceTyping"),
    thinking: t("chatPresenceThinking"),
  }
}

function buildChatThreadTexts(t: TranslateFn) {
  return {
    unreadLabel: t("chatThreadUnreadLabel"),
  }
}

export {
  buildChatBubbleLabels,
  buildChatCommandPaletteTexts,
  buildChatConversationsLabels,
  buildChatInputToolbarLabels,
  buildChatPresenceLabels,
  buildChatSenderLabels,
  buildChatThreadTexts,
  buildMessageActionsLabels,
  type TranslateFn,
}
