import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Loader2, Settings2, Plus, Search, Edit, Trash2, Folder } from "lucide-react";
import { commonCodeService, CommonCodeResponse, CommonCodeGroupResponse } from "@/services/commonCodeService";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";

type AdminCommonCodeSectionProps = {
  active: boolean;
};

type ApiErrorResponse = {
  message?: string;
  code?: number;
};

const getErrorMessage = (err: unknown): string => {
  if (err instanceof AxiosError) {
    const errorData = err.response?.data as ApiErrorResponse | undefined;
    return errorData?.message || err.message || "알 수 없는 오류가 발생했습니다.";
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "알 수 없는 오류가 발생했습니다.";
};

export function AdminCommonCodeSection({ active }: AdminCommonCodeSectionProps) {
  // State 관리
  const [groups, setGroups] = useState<CommonCodeGroupResponse[]>([]);
  const [codes, setCodes] = useState<CommonCodeResponse[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [codesLoading, setCodesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // 페이징 관련
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // 코드 모달
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<CommonCodeResponse | null>(null);
  const [codeFormData, setCodeFormData] = useState({
    codeId: "",
    codeName: "",
    description: "",
    sortOrder: 0,
    isActive: true,
  });

  // 그룹 모달
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CommonCodeGroupResponse | null>(null);
  const [groupFormData, setGroupFormData] = useState({
    groupId: "",
    groupName: "",
    description: "",
  });

  // 그룹 목록 불러오기
  useEffect(() => {
    if (!active) return;

    const fetchGroups = async () => {
      try {
        setLoading(true);
        const res = await commonCodeService.getAllGroups(0, 100);
        setGroups(res.content ?? []);
        if (res.content && res.content.length > 0) {
          setSelectedGroupId(res.content[0].groupId);
        }
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [active]);

  // 선택된 그룹의 코드 목록 불러오기
  useEffect(() => {
    if (!selectedGroupId) return;

    const fetchCodes = async () => {
      try {
        setCodesLoading(true);
        const res = await commonCodeService.getCodesByGroupPaged(selectedGroupId, currentPage, pageSize);
        setCodes(res.content ?? []);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setCodesLoading(false);
      }
    };

    fetchCodes();
  }, [selectedGroupId, currentPage]);

  // 검색 필터링
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return codes;
    return codes.filter(
      (c) =>
        c.codeId.toLowerCase().includes(q) ||
        c.codeName.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [codes, searchQuery]);

  // 검색 핸들러
  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // === 그룹 관련 함수 ===
  const handleOpenGroupModal = (group?: CommonCodeGroupResponse) => {
    if (group) {
      setEditingGroup(group);
      setGroupFormData({
        groupId: group.groupId,
        groupName: group.groupName,
        description: group.description || "",
      });
    } else {
      setEditingGroup(null);
      setGroupFormData({
        groupId: "",
        groupName: "",
        description: "",
      });
    }
    setGroupModalOpen(true);
  };

  const handleCloseGroupModal = () => {
    setGroupModalOpen(false);
    setEditingGroup(null);
    setGroupFormData({
      groupId: "",
      groupName: "",
      description: "",
    });
  };

  const handleSubmitGroup = async () => {
    if (!groupFormData.groupId || !groupFormData.groupName) {
      toast({
        title: "오류",
        description: "그룹 ID와 그룹명은 필수입니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingGroup) {
        // 수정
        await commonCodeService.updateGroup(groupFormData.groupId, {
          groupId: groupFormData.groupId,
          groupName: groupFormData.groupName,
          description: groupFormData.description || undefined,
        });
        toast({
          title: "수정 완료",
          description: "그룹이 수정되었습니다.",
        });
      } else {
        // 등록
        await commonCodeService.createGroup({
          groupId: groupFormData.groupId,
          groupName: groupFormData.groupName,
          description: groupFormData.description || undefined,
        });
        toast({
          title: "등록 완료",
          description: "새 그룹이 등록되었습니다.",
        });
      }

      // 그룹 목록 새로고침
      const res = await commonCodeService.getAllGroups(0, 100);
      setGroups(res.content ?? []);
      handleCloseGroupModal();
    } catch (err) {
      toast({
        title: "오류",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm("이 그룹을 삭제하시겠습니까? 그룹에 속한 모든 코드도 함께 삭제됩니다.")) {
      return;
    }

    try {
      await commonCodeService.deleteGroup(groupId);
      toast({
        title: "삭제 완료",
        description: "그룹이 삭제되었습니다.",
      });

      // 그룹 목록 새로고침
      const res = await commonCodeService.getAllGroups(0, 100);
      setGroups(res.content ?? []);

      // 선택된 그룹이 삭제된 경우
      if (selectedGroupId === groupId) {
        setSelectedGroupId(res.content && res.content.length > 0 ? res.content[0].groupId : "");
      }
    } catch (err) {
      toast({
        title: "오류",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    }
  };

  // === 코드 관련 함수 ===
  const handleOpenCodeModal = (code?: CommonCodeResponse) => {
    if (code) {
      setEditingCode(code);
      setCodeFormData({
        codeId: code.codeId,
        codeName: code.codeName,
        description: code.description || "",
        sortOrder: code.sortOrder,
        isActive: code.isActive,
      });
    } else {
      setEditingCode(null);
      setCodeFormData({
        codeId: "",
        codeName: "",
        description: "",
        sortOrder: 0,
        isActive: true,
      });
    }
    setCodeModalOpen(true);
  };

  const handleCloseCodeModal = () => {
    setCodeModalOpen(false);
    setEditingCode(null);
    setCodeFormData({
      codeId: "",
      codeName: "",
      description: "",
      sortOrder: 0,
      isActive: true,
    });
  };

  const handleSubmitCode = async () => {
    console.log("=== 코드 등록 디버깅 ===");
    console.log("selectedGroupId:", selectedGroupId);
    console.log("codeFormData:", codeFormData);
    console.log("선택된 그룹:", selectedGroup);

    if (!selectedGroupId) {
      toast({
        title: "오류",
        description: "그룹을 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!codeFormData.codeId || !codeFormData.codeName) {
      toast({
        title: "오류",
        description: "코드 ID와 코드명은 필수입니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingCode) {
        // 수정
        await commonCodeService.updateCode(selectedGroupId, codeFormData.codeId, {
          codeId: codeFormData.codeId,
          groupId: selectedGroupId,
          codeName: codeFormData.codeName,
          description: codeFormData.description || undefined,
          sortOrder: codeFormData.sortOrder,
          isActive: codeFormData.isActive,
        });
        toast({
          title: "수정 완료",
          description: "코드가 수정되었습니다.",
        });
      } else {
        // 등록
        await commonCodeService.createCode({
          codeId: codeFormData.codeId,
          groupId: selectedGroupId,
          codeName: codeFormData.codeName,
          description: codeFormData.description || undefined,
          sortOrder: codeFormData.sortOrder,
          isActive: codeFormData.isActive,
        });
        toast({
          title: "등록 완료",
          description: "새 코드가 등록되었습니다.",
        });
      }

      // 목록 새로고침
      const res = await commonCodeService.getCodesByGroupPaged(selectedGroupId, currentPage, pageSize);
      setCodes(res.content ?? []);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
      handleCloseCodeModal();
    } catch (err) {
      toast({
        title: "오류",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (code: CommonCodeResponse) => {
    try {
      if (code.isActive) {
        await commonCodeService.deactivateCode(selectedGroupId, code.codeId);
        toast({
          title: "비활성화 완료",
          description: `${code.codeName}이(가) 비활성화되었습니다.`,
        });
      } else {
        await commonCodeService.activateCode(selectedGroupId, code.codeId);
        toast({
          title: "활성화 완료",
          description: `${code.codeName}이(가) 활성화되었습니다.`,
        });
      }

      // 목록 새로고침
      const res = await commonCodeService.getCodesByGroupPaged(selectedGroupId, currentPage, pageSize);
      setCodes(res.content ?? []);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (err) {
      toast({
        title: "오류",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    }
  };

  const selectedGroup = groups.find((g) => g.groupId === selectedGroupId);

  return (
    <>
      <Card className="card-shadow overflow-hidden">
        <CardHeader className="bg-muted/40 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Settings2 className="h-4 w-4" />
            <span>공통 코드 관리</span>
          </div>
          <CardTitle className="text-xl">코드 그룹 및 코드 관리</CardTitle>
          <p className="text-sm text-muted-foreground">
            왼쪽에서 그룹을 선택하고, 오른쪽에서 코드를 관리할 수 있습니다.
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex gap-4 items-start">
            {/* 왼쪽: 그룹 목록 */}
            <div className="w-64 shrink-0 self-stretch">
              <div className="space-y-2 h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold">코드 그룹</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenGroupModal()}
                    className="h-7 px-2"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    그룹
                  </Button>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    로딩 중...
                  </div>
                ) : groups.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border bg-background/70 py-8 text-center text-sm text-muted-foreground">
                    그룹이 없습니다
                  </div>
                ) : (
                  <div className="space-y-1 overflow-y-auto flex-1 pr-2">
                    {groups.map((group) => (
                      <div
                        key={group.groupId}
                        className={cn(
                          "group flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors cursor-pointer",
                          selectedGroupId === group.groupId
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50 hover:bg-muted/40"
                        )}
                      >
                        <div
                          className="flex-1 flex items-center gap-2"
                          onClick={() => setSelectedGroupId(group.groupId)}
                        >
                          <Folder className="h-4 w-4 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{group.groupName}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {group.groupId}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenGroupModal(group);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteGroup(group.groupId);
                            }}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 오른쪽: 코드 목록 */}
            <div className="flex-1">
              {!selectedGroupId ? (
                <div className="rounded-lg border border-dashed border-border bg-background/70 py-16 text-center text-muted-foreground">
                  그룹을 선택해주세요
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 선택된 그룹 정보 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{selectedGroup?.groupName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedGroup?.description || "설명 없음"}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleOpenCodeModal()}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      코드 등록
                    </Button>
                  </div>

                  {/* 검색 */}
                  <div className="flex gap-2">
                    <Input
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="코드 ID, 코드명으로 검색"
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon" onClick={handleSearch}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* 테이블 */}
                  {error ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-5 w-5" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  ) : codesLoading ? (
                    <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      코드 목록을 불러오는 중...
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border bg-background/70 py-10 text-center text-muted-foreground">
                      {searchQuery ? "검색 결과가 없습니다." : "등록된 코드가 없습니다."}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-border overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/40">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">코드 ID</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">코드명</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">설명</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">
                              사용여부
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">작업</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map((code) => (
                            <tr
                              key={code.codeId}
                              className="border-t border-border hover:bg-muted/20"
                            >
                              <td className="px-4 py-3 text-sm font-mono">{code.codeId}</td>
                              <td className="px-4 py-3 text-sm">{code.codeName}</td>
                              <td className="px-4 py-3 text-sm text-muted-foreground">
                                {code.description || "-"}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Badge
                                  variant={code.isActive ? "default" : "secondary"}
                                  className={
                                    code.isActive
                                      ? "bg-green-500/10 text-green-700 border-green-500/30"
                                      : "bg-gray-500/10 text-gray-700 border-gray-500/30"
                                  }
                                >
                                  {code.isActive ? "사용" : "미사용"}
                                </Badge>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenCodeModal(code)}
                                    className="flex items-center gap-1"
                                  >
                                    <Edit className="h-3 w-3" />
                                    수정
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleToggleActive(code)}
                                    className={
                                      code.isActive
                                        ? "flex items-center gap-1 text-destructive border-destructive/40 hover:bg-destructive/10"
                                        : "flex items-center gap-1"
                                    }
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    {code.isActive ? "비활성화" : "활성화"}
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* 페이징 */}
                  {!error && !codesLoading && totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                      <p className="text-sm text-muted-foreground">
                        총 {totalElements}개 중 {currentPage * pageSize + 1}-
                        {Math.min((currentPage + 1) * pageSize, totalElements)}개 표시
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(0)}
                          disabled={currentPage === 0}
                        >
                          처음
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => prev - 1)}
                          disabled={currentPage === 0}
                        >
                          이전
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i;
                            } else if (currentPage < 3) {
                              pageNum = i;
                            } else if (currentPage > totalPages - 3) {
                              pageNum = totalPages - 5 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="w-8 h-8 p-0"
                              >
                                {pageNum + 1}
                              </Button>
                            );
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => prev + 1)}
                          disabled={currentPage === totalPages - 1}
                        >
                          다음
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(totalPages - 1)}
                          disabled={currentPage === totalPages - 1}
                        >
                          마지막
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 그룹 등록/수정 모달 */}
      <Dialog open={groupModalOpen} onOpenChange={setGroupModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingGroup ? "그룹 수정" : "그룹 등록"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="groupId">
                그룹 ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="groupId"
                value={groupFormData.groupId}
                onChange={(e) => setGroupFormData({ ...groupFormData, groupId: e.target.value })}
                placeholder="예: USER_STATUS"
                disabled={!!editingGroup}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupName">
                그룹명 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="groupName"
                value={groupFormData.groupName}
                onChange={(e) =>
                  setGroupFormData({ ...groupFormData, groupName: e.target.value })
                }
                placeholder="예: 사용자 상태"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupDescription">설명</Label>
              <Input
                id="groupDescription"
                value={groupFormData.description}
                onChange={(e) =>
                  setGroupFormData({ ...groupFormData, description: e.target.value })
                }
                placeholder="그룹 설명 (선택사항)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseGroupModal}>
              취소
            </Button>
            <Button onClick={handleSubmitGroup}>
              {editingGroup ? "수정하기" : "등록하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 코드 등록/수정 모달 */}
      <Dialog open={codeModalOpen} onOpenChange={setCodeModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCode ? "코드 수정" : "코드 등록"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="codeId">
                코드 ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="codeId"
                value={codeFormData.codeId}
                onChange={(e) => setCodeFormData({ ...codeFormData, codeId: e.target.value })}
                placeholder="예: ACTIVE"
                disabled={!!editingCode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codeName">
                코드명 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="codeName"
                value={codeFormData.codeName}
                onChange={(e) => setCodeFormData({ ...codeFormData, codeName: e.target.value })}
                placeholder="예: 활성"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Input
                id="description"
                value={codeFormData.description}
                onChange={(e) =>
                  setCodeFormData({ ...codeFormData, description: e.target.value })
                }
                placeholder="코드 설명 (선택사항)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">정렬 순서</Label>
              <Input
                id="sortOrder"
                type="number"
                value={codeFormData.sortOrder}
                onChange={(e) =>
                  setCodeFormData({ ...codeFormData, sortOrder: parseInt(e.target.value) || 0 })
                }
                placeholder="0"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={codeFormData.isActive}
                onCheckedChange={(checked) =>
                  setCodeFormData({ ...codeFormData, isActive: checked })
                }
              />
              <Label htmlFor="isActive">사용 여부</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseCodeModal}>
              취소
            </Button>
            <Button onClick={handleSubmitCode}>
              {editingCode ? "수정하기" : "등록하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
