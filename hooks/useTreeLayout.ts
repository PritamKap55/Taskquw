import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

import { getInDeviceTree, saveInDevicetree } from "../services/dataStorage";
import { getAccessToken } from "../services/googleAuth";
import {
    TreeNodeType,
    appendTreeNode,
    deleteTreeRows,
    fetchTreeFromSheet,
} from "../services/treeService";

import { treeview } from "../constants/data";


type Props = {
    template?: string;
    layout: string;
    headtext: string;
    userEmail: string;
    login: string;
};

export const useTreeLayout = ({ template, layout, headtext, userEmail, login,
}: Props) => {
    const params = useLocalSearchParams();

    const spreadsheetId = String(params?.id ?? "");

    const [loading, setLoading] = useState(false);

    const [nodetext, setNodetext] = useState("");

    const [selectnode, setSelectnode] = useState(0);

    const [selectnodetext, setSelectnodetext] =
        useState("");

    const [openNodes, setOpenNodes] =
        useState<number[]>([]);

    const [treeData, setTreeData] =
        useState<TreeNodeType[]>(treeview);

    const [hue, setHue] = useState(0);

    /**
     * Find node recursively
     */
    const findNodeById = (
        nodes: TreeNodeType[],
        id: number
    ): TreeNodeType | null => {
        for (const node of nodes) {
            if (node.id === id) {
                return node;
            }

            if (node.children?.length) {
                const found = findNodeById(
                    node.children,
                    id
                );

                if (found) {
                    return found;
                }
            }
        }

        return null;
    };

    /**
     * Get maximum ID
     */
    const getLastId = (
        nodes: TreeNodeType[]
    ): number => {
        let maxId = 0;

        const traverse = (
            items: TreeNodeType[]
        ) => {
            for (const item of items) {
                if (item.id > maxId) {
                    maxId = item.id;
                }

                if (item.children?.length) {
                    traverse(item.children);
                }
            }
        };

        traverse(nodes);

        return maxId;
    };

    /**
     * Add node to tree
     */
    const addChildNode = (
        nodes: TreeNodeType[],
        parentId: number,
        newChild: TreeNodeType
    ): TreeNodeType[] => {
        return nodes.map((node) => {
            if (node.id === parentId) {
                return {
                    ...node,
                    children: [
                        ...(node.children || []),
                        newChild,
                    ],
                };
            }

            return {
                ...node,
                children: node.children
                    ? addChildNode(
                        node.children,
                        parentId,
                        newChild
                    )
                    : [],
            };
        });
    };

    /**
     * Get rows recursively
     */
    const getRowsToDelete = (
        node: TreeNodeType,
        rows: number[] = []
    ): number[] => {
        rows.push(node.rowNumber);

        node.children?.forEach((child) => {
            getRowsToDelete(child, rows);
        });

        return rows;
    };


    const getSheetData = async () => {
        if (!spreadsheetId) {
            return;
        }

        try {
            setLoading(true);

            const accessToken =
                await getAccessToken();

            // ONLINE
            if (accessToken) {
                try {
                    if (login == "Login") {
                        const tree =
                            await fetchTreeFromSheet(
                                spreadsheetId,
                                accessToken
                            );

                        setTreeData(tree);

                        // Save latest data for offline use
                        await saveInDevicetree(userEmail, spreadsheetId, tree);
                    }
                    else {
                        const result = await getInDeviceTree(userEmail, spreadsheetId);
                        setTreeData(result);
                    }
                    return;
                } catch (error) {
                    console.log(
                        "Online loading failed. Trying cache..."
                    );
                }
            }

            

        } catch (error) {
            console.error(
                "Error getSheetData:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    /**
     * Select node
     */
    const handleNodePress = (id: number) => {
        // IMPORTANT:
        // use id directly instead of selectnode
        const node = findNodeById(
            treeData,
            id
        );

        setSelectnode(id);

        setSelectnodetext(
            node?.name ?? ""
        );
    };

    /**
     * Toggle node
     */
    const toggleNode = (id: number) => {
        setSelectnode(id);

        const node = findNodeById(
            treeData,
            id
        );

        setSelectnodetext(
            node?.name ?? ""
        );

        setOpenNodes((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

    /**
     * Add root
     */
    const handleAddRoot = async () => {
        if (!nodetext.trim()) {
            Alert.alert(
                "Validation",
                "Please enter a node name."
            );
            return;
        }

        const newNode: TreeNodeType = {
            id: getLastId(treeData) + 1,
            name: nodetext.trim(),
            parent: 0,
            rowNumber: 0,
            children: [],
        };

        try {
            const accessToken =
                await getAccessToken();

            if (!accessToken) {
                Alert.alert(
                    "Offline",
                    "Cannot add a node while offline."
                );
                return;
            }

            await appendTreeNode(
                spreadsheetId,
                accessToken,
                newNode
            );

            setNodetext("");

            await getSheetData();

        } catch (error) {
            console.error(
                "Error handleAddRoot:",
                error
            );
        }
    };

    /**
     * Add child
     */
    const handleAddChild = async () => {
        if (!nodetext.trim()) {
            Alert.alert(
                "Validation",
                "Please enter a node name."
            );
            return;
        }

        if (selectnode === 0) {
            Alert.alert(
                "Select node",
                "Please select a parent node."
            );
            return;
        }

        const parentNode = findNodeById(
            treeData,
            selectnode
        );

        if (!parentNode) {
            return;
        }

        const newNode: TreeNodeType = {
            id: getLastId(treeData) + 1,
            name: nodetext.trim(),
            parent: selectnode,
            rowNumber: 0,
            children: [],
        };

        try {
            const accessToken =
                await getAccessToken();

            if (!accessToken) {
                Alert.alert(
                    "Offline",
                    "Cannot add a node while offline."
                );
                return;
            }

            await appendTreeNode(
                spreadsheetId,
                accessToken,
                newNode
            );

            setNodetext("");

            await getSheetData();

        } catch (error) {
            console.error(
                "Error handleAddChild:",
                error
            );
        }
    };

    /**
     * Delete selected node
     */
    const handleDelete = async () => {
        if (selectnode === 0) {
            Alert.alert(
                "Select node",
                "Please select a node first."
            );
            return;
        }

        const node = findNodeById(
            treeData,
            selectnode
        );

        if (!node) {
            return;
        }

        Alert.alert(
            "Delete",
            `Delete "${node.name}" and its children?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const accessToken =
                                await getAccessToken();

                            if (!accessToken) {
                                Alert.alert(
                                    "Offline",
                                    "Cannot delete while offline."
                                );
                                return;
                            }

                            const rows =
                                getRowsToDelete(node);

                            await deleteTreeRows(
                                spreadsheetId,
                                accessToken,
                                rows
                            );

                            setSelectnode(0);
                            setSelectnodetext("");

                            await getSheetData();

                        } catch (error) {
                            console.error(
                                "Delete error:",
                                error
                            );
                        }
                    },
                },
            ]
        );
    };

    useEffect(() => {
        if (spreadsheetId) {
            getSheetData();
        }
    }, [spreadsheetId]);

    return {
        loading,

        hue,
        setHue,

        nodetext,
        setNodetext,

        selectnode,
        selectnodetext,

        openNodes,

        treeData,

        handleNodePress,
        toggleNode,

        handleAddRoot,
        handleAddChild,
        handleDelete,

        getSheetData,
    };
};