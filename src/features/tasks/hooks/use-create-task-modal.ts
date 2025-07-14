import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";

export const useCreateTaskModal = () => {
	const [isOpen, setIsOpen] = useQueryState(
		"create-task",
		parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
	);

	const [prefillName, setPrefillName] = useQueryState(
		"task-name",
		parseAsString.withDefault("").withOptions({ clearOnDefault: true })
	);

	const open = (options?: { prefillName?: string }) => {
		if (options?.prefillName) {
			setPrefillName(options.prefillName);
		}
		setIsOpen(true);
	};

	const close = () => {
		setIsOpen(false);
		setPrefillName("");
	};

	return {
		isOpen,
		prefillName,
		open,
		close,
		setIsOpen,
	};
};
