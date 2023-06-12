// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';

import {mtrim} from 'js-trim-multiline-string';

import {DraftPlaybookWithChecklist, emptyPlaybook, newChecklistItem} from 'src/types/playbook';

import MattermostLogo from 'src/components/assets/mattermost_logo_svg';
import ClipboardChecklist from 'src/components/assets/illustrations/clipboard_checklist_svg';
import DumpsterFire from 'src/components/assets/illustrations/dumpster_fire_svg';
import Gears from 'src/components/assets/illustrations/gears_svg';
import Handshake from 'src/components/assets/illustrations/handshake_svg';
import Rocket from 'src/components/assets/illustrations/rocket_svg';
import SmileySunglasses from 'src/components/assets/illustrations/smiley_sunglasses_svg';
import BugSearch from 'src/components/assets/illustrations/bug_search_svg';
import LightBulb from 'src/components/assets/illustrations/light_bulb_svg';
// import Audit from 'src/components/assets/illustrations/Audit_svg';

export interface PresetTemplate {
    label?: string;
    labelColor?: string;
    title: string;
    description?: string;

    author?: ReactNode;
    icon: ReactNode;
    color?: string;
    template: DraftPlaybookWithChecklist;
}

const preprocessTemplates = (presetTemplates: PresetTemplate[]): PresetTemplate[] => (
    presetTemplates.map((pt) => ({
        ...pt,
        template: {
            ...pt.template,
            num_stages: pt.template?.checklists.length,
            num_actions:
                1 + // Channel creation is hard-coded
                (pt.template.message_on_join_enabled ? 1 : 0) +
                (pt.template.signal_any_keywords_enabled ? 1 : 0) +
                (pt.template.run_summary_template_enabled ? 1 : 0),
            checklists: pt.template?.checklists.map((checklist) => ({
                ...checklist,
                items: checklist.items?.map((item) => ({
                    ...newChecklistItem(),
                    ...item,
                })) || [],
            })),
        },
    }))
);

export const PresetTemplates: PresetTemplate[] = preprocessTemplates([
    {
        title: 'Blank',
        icon: <ClipboardChecklist/>,
        color: '#FFBC1F14',
        description: '빈 양식에서 필요한 내용을 직접 구성할 수 있습니다',
        template: {
            ...emptyPlaybook(),
            title: 'Blank',
            description: '이 플레이북에 대한 설명을 추가해서 플레이북을 언제 Run하는지, 용도는 무엇인지 알리세요.',
        },
    },
    {
        title: 'Product 릴리스',
        description: '아이디어 구상부터 제작까지 릴리스 프로세스를 완벽하게 진행할 수 있습니다.',
        icon: <Rocket/>,
        color: '#C4313314',
        // author: <MattermostLogo/>,
        template: {
            ...emptyPlaybook(),
            title: 'Product 릴리스',
            description: '소속 조직의 릴리스 프로세스를 반영해서 수정하세요',
            checklists: [
                {
                    title: '코드 작성',
                    items: [
                        newChecklistItem('보류 중인 티켓과 PR 분류 및 확인'),
                        newChecklistItem('변경기록, 기능 설명 문서 등 자료 준비'),
                        newChecklistItem('필요한 프로젝트 의존성 확인 및 리뷰'),
                        newChecklistItem('QA 릴리스 테스트 준비'),                        
                    ],
                },
                {
                    title: '릴리스 테스트',
                    items: [
                        newChecklistItem('Release Candidate (RC-1) 준비'),
                        newChecklistItem('QA: Pre-release 빌드 smoke test 수행'),
                        newChecklistItem('QA: Pre-release 빌드에 load test 및 upgrade test 수행'),
                        newChecklistItem('버그 픽스 및 재분류, QA Test 재수행'),
                    ],
                },
                {
                    title: '출시 준비',
                    items: [
                        newChecklistItem('QA 최종 승인'),
                        newChecklistItem('릴리스 빌드 발행'),
                        newChecklistItem('변경기록, 업그레이드 노트, 기능 설명 문서 배포'),
                        newChecklistItem('최소 요구사양, 운용환경 확인 및 확정'),
                        newChecklistItem('릴리스 다운로드 링크 및 파일 저장소 업데이트'),
                        newChecklistItem('릴리스 발표'),
                    ],
                },
                {
                    title: '출시 후 조치',
                    items: [
                        newChecklistItem('릴리스 회고 일정 수립'),
                        newChecklistItem('다음 릴리스 계획 반영 및 이해관계자 협의'),
                        newChecklistItem('릴리스 지표 작성'),                        
                        newChecklistItem('전 버전 채널 보관 및 다음 릴리스 채널 생성'),
                    ],
                },
            ],
            create_public_playbook_run: false,
            channel_name_template: 'Release (vX.Y)',
            message_on_join_enabled: true,
            message_on_join:
                mtrim`안녕하세요!

                이 채널은 **Product 릴리스** 플레이북의 일부로 생성되어 릴리스 계획과 이슈에 대해 커뮤니케이션 목적으로 운영됩니다. 신규 채널 멤버들에게 제공할 정보가 있다면 이 메시지를 수정해서 사용하세요. 메시지에는 마크다운 문법을 사용할 수 있습니다.`,
            run_summary_template_enabled: true,
            run_summary_template:
                mtrim`**개요**
                - 버전 넘버: TBD
                - 릴리스 목표일: TBD

                **Resources**
                - SVN 저장소 URL: [link TBD](#)`,                
            reminder_message_template:
                mtrim`### 마지막 업데이트 이후 변경사항
                -

                ### 지연 중인 PR
                - `,
            reminder_timer_default_seconds: 24 * 60 * 60, // 24 hours
            retrospective_template:
                mtrim`### Start
                -

                ### Stop
                -

                ### Keep
                - `,
            retrospective_reminder_interval_seconds: 0, // Once
        },
    },
    {
        title: '긴급 이슈 처리',
        description: '긴급 이슈 처리에는 속도와 정확성이 필요합니다. 신속한 대응과 해결을 위해 프로세스를 간소화하세요.',
        icon: <DumpsterFire/>,
        author: <MattermostLogo/>,
        color: '#33997014',
        template: {
            ...emptyPlaybook(),
            title: '긴급 이슈 처리',
            description: '이 플레이북을 수정해서 자체 이슈 처리 프로세스를 반영하세요.',
            checklists: [
                {
                    title: '착수 준비',
                    items: [
                        newChecklistItem('담당 엔지니어 채널 추가'),
                        newChecklistItem('그룹 미팅 소집'),
                        newChecklistItem('현재 이슈 공유 자료 준비'),
                        newChecklistItem('이슈 등록 및 담당자 할당'),                        
                        newChecklistItem('긴급도 설정'),                        
                    ],
                },
                {
                    title: '원인 분석',
                    items: [
                        newChecklistItem('여기에 의심되는 원인을 추가하고 제거되면 체크 표시하세요.'),
                    ],
                },
                {
                    title: '해결',
                    items: [
                        newChecklistItem('이슈 해소 확인'),
                        newChecklistItem('이해관계자 통보'),                        
                    ],
                },
                {
                    title: '회고',
                    items: [
                        newChecklistItem('참여자 BP, LL 검토'),
                        newChecklistItem('사후 검토 회의 일정 잡기'),
                        newChecklistItem('주요 메시지를 타임라인 항목으로 저장'),
                        newChecklistItem('회고 보고서 발행'),
                    ],
                },
            ],
            create_public_playbook_run: false,
            channel_name_template: '이벤트 제목: <name>',
            message_on_join_enabled: true,
            message_on_join:
                mtrim`환영합니다!

                이 채널은 **긴급 이슈 처리** 플레이북의 일부로 생성되어 이슈 해결 커뮤니케이션 목적으로 운영됩니다. 신규 채널 멤버들에게 제공할 정보가 있다면 이 메시지를 수정해서 사용하세요. 메시지에는 마크다운 문법을 사용할 수 있습니다.`,
            run_summary_template_enabled: true,
            run_summary_template:
                mtrim`**요약**

                **대외/대내 고객 영향성**

                **참고사항**
                - 긴급도: #sev-1/2/3
                - 관련 멤버:
                - 예상 기간:`,
            reminder_message_template: '',
            reminder_timer_default_seconds: 60 * 60, // 1 hour
            retrospective_template:
                mtrim`### 요약
                여기에는 무슨 일이 일어났는지, 원인이 무엇인지, 어떻게 조치되었는지에 대한 개요를 파악할 수 있는 2~3개의 문장이 포함되어야 합니다. 향후 팀에서 참조할 수 있도록 간결할수록 좋습니다.

                ### 영향성은 어떤가?
                이 섹션에서는 해당 이슈의 영향성에 대해 기술합니다.

                ### 이슈를 유발한 원인은 무엇인가?
                이 플레이북은 바람직하지 않은 상황에 대한 사후 대응 프로토콜일 수 있습니다. 이 경우 이 섹션에서는 처음에 상황을 초래한 원인을 설명합니다. 여러 가지 근본 원인이 있을 수 있으므로 이해관계자가 그 이유를 이해하는 데 도움이 됩니다.

                ### 어떤 조치를 했는가?
                이 섹션에서는 이벤트가 진행되는 동안 팀이 어떻게 협업하여 결과를 달성했는지에 대한 이야기를 설명합니다. 이는 향후 팀이 이 경험을 통해 무엇을 시도할 수 있는지 배우는 데 도움이 됩니다.

                ### 우리는 무엇을 배웠는가?
                이 섹션에서는 이벤트가 진행되는 동안 팀이 어떻게 협업하여 결과를 달성했는지에 대한 이야기를 설명합니다. 이는 향후 팀이 이 경험을 통해 무엇을 시도할 수 있는지 배우는 데 도움이 됩니다. BP와 LL로 기록해야 할 경우 별도로 작성하여 등재합니다.

                ### 후속 업무
                이 섹션에는 팀이 반복 작업에 더욱 능숙해질 수 있도록 학습한 내용을 변경 사항으로 전환하기 위한 실행 항목이 나열되어 있습니다. 여기에는 플레이북 조정, 회고 게시 또는 기타 개선 사항이 포함될 수 있습니다. 후속 조치에는 명확한 소유자와 마감일이 지정되어 있는것이 좋습니다.

                ### 타임라인 하이라이트
                이 섹션은 이슈 해결 과정에서 중요한 순간을 자세히 설명합니다. 여기에는 주요 커뮤니케이션, 스크린샷 또는 기타 결함 설명들이 포함될 수 있습니다. 기본 제공 타임라인 기능을 사용하면 이벤트 순서를 되짚어보고 재생할 수 있습니다.`,
            retrospective_reminder_interval_seconds: 24 * 60 * 60, // 24 hours
            signal_any_keywords_enabled: true,
            signal_any_keywords: ['sev-1', 'sev-2', '#이슈', '심각'],
        },
    },
    // {
    //     title: 'Customer Onboarding',
    //     description: 'Create a standardized, smooth onboarding experience for new customers to get them up and running quickly. ',
    //     icon: <Handshake/>,
    //     color: '#3C507A14',
    //     author: <MattermostLogo/>,
    //     template: {
    //         ...emptyPlaybook(),
    //         title: 'Customer Onboarding',
    //         description: mtrim`New Mattermost customers are onboarded following a process similar to this playbook.

    //         Customize this playbook to reflect your own customer onboarding process.`,
    //         checklists: [
    //             {
    //                 title: 'Sales to Post-Sales Handoff',
    //                 items: [
    //                     newChecklistItem('AE intro CSM and CSE to key contacts'),
    //                     newChecklistItem('Create customer account Drive folder'),
    //                     newChecklistItem('Welcome email within 24hr of Closed Won'),
    //                     newChecklistItem('Schedule initial kickoff call with customer'),
    //                     newChecklistItem('Create account plan (Tier 1 or 2)'),
    //                     newChecklistItem('Send discovery Survey'),
    //                 ],
    //             },
    //             {
    //                 title: 'Customer Technical Onboarding',
    //                 items: [
    //                     newChecklistItem('Schedule technical discovery call'),
    //                     newChecklistItem('Review current Zendesk tickets and updates'),
    //                     newChecklistItem('Log customer technical details in Salesforce'),
    //                     newChecklistItem('Confirm customer received technical discovery summary package'),
    //                     newChecklistItem('Send current Mattermost “Pen Test” report to customer'),
    //                     newChecklistItem('Schedule plugin/integration planning session'),
    //                     newChecklistItem('Confirm data migration plans'),
    //                     newChecklistItem('Extend Mattermost with integrations'),
    //                     newChecklistItem('Confirm functional & load test plans'),
    //                     newChecklistItem('Confirm team/channel organization'),
    //                     newChecklistItem('Sign up for Mattermost blog for releases and announcements'),
    //                     newChecklistItem('Confirm next upgrade version'),
    //                 ],
    //             },
    //             {
    //                 title: 'Go-Live',
    //                 items: [
    //                     newChecklistItem('Order Mattermost swag package for project team'),
    //                     newChecklistItem('Confirm end-user roll-out plan'),
    //                     newChecklistItem('Confirm customer go-live'),
    //                     newChecklistItem('Perform post go-live retrospective'),
    //                 ],
    //             },
    //             {
    //                 title: 'Optional value prompts after go-live',
    //                 items: [
    //                     newChecklistItem('Intro playbooks and boards'),
    //                     newChecklistItem('Inform upgrading Mattermost 101'),
    //                     newChecklistItem('Share tips & tricks w/ DevOps focus'),
    //                     newChecklistItem('Share tips & tricks w/ efficiency focus'),
    //                     newChecklistItem('Schedule quarterly roadmap review w/ product team'),
    //                     newChecklistItem('Review with executives (Tier 1 or 2)'),
    //                 ],
    //             },
    //         ],
    //         create_public_playbook_run: false,
    //         channel_name_template: 'Customer Onboarding: <name>',
    //         message_on_join_enabled: true,
    //         message_on_join:
    //             mtrim`Hello and welcome!

    //             This channel was created as part of the **Customer Onboarding** playbook and is where conversations related to this customer are held. You can customize this message using markdown so that every new channel member can be welcomed with helpful context and resources.`,
    //         run_summary_template_enabled: true,
    //         run_summary_template:
    //             mtrim`**About**
    //             - Account name: [TBD](#)
    //             - Salesforce opportunity: [TBD](#)
    //             - Order type:
    //             - Close date:

    //             **Team**
    //             - Sales Rep: @TBD
    //             - Customer Success Manager: @TBD`,
    //         retrospective_template:
    //             mtrim`### What went well?
    //             -

    //             ### What could have gone better?
    //             -

    //             ### What should be changed for next time?
    //             - `,
    //         retrospective_reminder_interval_seconds: 0, // Once
    //     },
    // },
    {
        title: '신입 직원 온보딩',
        description: '신입 직원의 신속한 적응을 지원하기 위한 프로세스를 반영하세요.',
        icon: <SmileySunglasses/>,
        color: '#FFBC1F14',
        author: <MattermostLogo/>,
        template: {
            ...emptyPlaybook(),
            title: '신입/전입 직원 온보딩',
            description: mtrim`신입 또는 전입 직원이 있나요? 그렇다면 빠르고 완벽한 적응을 돕기 온보딩 프로세스를 수립하고 실행하세요.

            조직마다 고유한 온보딩 프로세스를 적용할 수 있습니다.`,
            checklists: [
                {
                    title: '입사 예정 1일전',
                    items: [
                        newChecklistItem('자리 배정'),
                        newChecklistItem(
                            '온보딩 템플릿 수정을 미리 완료하세요',
                            mtrim`관리자는 새로운 직원이 조직에서 빠르게 적용하고 역할을 수행할 수 있도록 명확한 기대치를 설정해야합니다. 온보딩 프로세스가 잘 준비되어 있다면 신규 멤버 역시 조직과 관리자에 대한 믿음과 자신감을 바탕으로 빠르게 자기 능력을 발휘할 수 있을 것입니다.
                                * **온보딩 목표:** 새 팀원이 처음 90일 동안 집중해야 하는 영역과 프로젝트를 명확히 합니다.                                 
                                * **교육 계획 확인:** 부서 교육 담당자에게 OJT 및 직무교육 일정을 확인합니다.                                 
                                * **온보딩 조력자 지정:** 온보딩 조력자는 팀, 섹션 혹은 TFT에서 조직과 프로젝트에 대한 질문의 답을 해줄 수 있는 개인 또는 그룹이어야 합니다. 관리자는 조력자를 지정하기 전에 대상자와 사전에 협의하고 동의를 얻어야 합니다.`,
                        ),
                    ],
                },
                {
                    title: '첫번째 주',
                    items: [
                        newChecklistItem(
                            '새로운 멤버를 해당 채널에 소개',
                            mtrim`모든 신입 사원은 짧은 약력을 작성하고 관리자와 공유해야 합니다. 관리자는 환영 메시지에 이 약력을 포함해야 합니다.

                                채널에 포스팅 할 때 \#새동료 해시태그를 잊지마세요.`,
                        ),                        
                        newChecklistItem(
                            '주요 내부 업무 협력 파트너 목록 검토',
                            '신입 직원이 주로 커뮤니케이션하고 협력해야 할 팀내/외 인원들의 목록과 예상 업무들을 설명합니다.',
                        ),
                        newChecklistItem(
                            '관련 프로젝트 채널에 추가',
                            '소속 조직과 담당 업무에 적합한 채널에 신규 인력을 할당합니다',
                        ),
                        newChecklistItem(
                            '팀/섹션 또는 프로젝트 케이던스 공유',
                            '조직 및 프로젝트 목표와 현황과 주요 사용하는 용어, 관련된 플레이북에 대해 리뷰합니다.',
                        ),
                    ],
                },
                {
                    title: '2주후',
                    items: [                        
                        newChecklistItem('역할과 책임, 기대치에 대한 조율'),
                        newChecklistItem(
                            '피드백 체크',
                            '새로운 인원은 자기소개를 하고 2주동안 해온 일에 대해 발표합니다. 이 자리를 통해 누락된 지원이나 할당된 역할에 대해 협의하고 조정합니다.',
                        ),                        
                    ],
                },
                {
                    title: '60일 후',
                    items: [
                        newChecklistItem(
                            '60일 피드백',
                            '2개월 경과 후 적응상태에 대한 면담과 지원 소요에 대해 피드백을 확인합니다.',
                        ),
                    ],
                },                
            ],
            create_public_playbook_run: false,
            channel_name_template: '신입 직원 온보딩: <name>',
            message_on_join_enabled: true,
            message_on_join:
                mtrim`환영합니다!

                이 채널은 **신입 직원 온보딩** 플레이북의 일부로 생성되어 온보딩 계획과 진행상황에 대한 커뮤니케이션 목적으로 운영됩니다. 신규 채널 멤버들에게 제공할 정보가 있다면 이 메시지를 수정해서 사용하세요. 메시지에는 마크다운 문법을 사용할 수 있습니다.`,
            run_summary_template: '',
            reminder_timer_default_seconds: 7 * 24 * 60 * 60, // once a week
            retrospective_template:
                mtrim`### 어떤 점이 잘 되었나요?
                -

                ### 더 좋은 방법이 있을까요?
                -

                ### 다음번엔 뭘 바꾸면 더 좋아질까요?
                - `,
            retrospective_reminder_interval_seconds: 0, // Once
        },
    },
    {
        title: '심사 및 점검',
        description: '정기적으로 수검하는 정기 심사 및 점검을 대응하기 위한 플레이북입니다.',
        icon: <Handshake/>,
        color: '#62697E14',
        author: 'komoon@koreanair.com',
        template: {
            ...emptyPlaybook(),
            title: '심사 및 수검',
            description: '연구원 수검 심사 및 점검 대응을 위한 플레이북으로 이벤트 종류에 따라 수정해서 사용하세요',
            checklists: [
                {
                    title: '수검 준비',
                    items: [
                        newChecklistItem('수검 일자 및 심사관, 수검 중점 확인'),
                        newChecklistItem('대상 사업 선정'),
                        newChecklistItem('사업 PM 및 POC 협조'),
                        newChecklistItem('수검 계획 보고'),
                        newChecklistItem('심사관 회의실 예약'),
                        newChecklistItem('착수회의 자료 작성'),
                    ],
                },
                {
                    title: 'Kickoff 및 수검',
                    items: [
                        newChecklistItem(
                            '수검 당일 착수회의',
                            mtrim`심사 및 점검 중점에 따라 수정:
                            - 일정 계획
                            - 대상 사업 설명`,                            
                        ),
                        newChecklistItem('사업별 인터뷰'),                        
                    ],
                },
                {
                    title: '결과 정리',
                    items: [
                        newChecklistItem('결과 정리, 부적합 사항 도출'),
                        newChecklistItem('처리계획 요청'),                        
                        newChecklistItem('결과 보고서 작성 및 품의'),                        
                    ],
                },
                {
                    title: 'Follow up',
                    items: [
                        newChecklistItem('부적합 조치결과 확인'),                        
                    ],
                },
            ],
            create_public_playbook_run: true,
            channel_name_template: 'Audit: <name>',
            message_on_join_enabled: true,
            message_on_join:
                mtrim`안녕하세요!

                이 채널은 **심사 및 점검** 플레이북의 일부로 생성되어 관련 준비사항 및 수검 후속조치에 대한 커뮤니케이션을 목적으로 사용됩니다. 필요하다면 새 채널 멤버에게 전달할 메시지를 여기에 작성하세요. 메시지에는 마크다운 문법을 사용할 수 있습니다.`,
            run_summary_template_enabled: true,
            run_summary_template:
                mtrim`**심사 요약**
                나중에 참고할 수 있도록 금번 수검한 심사 개요와 경과에 대해 작성합니다.

                **대상 사업**
                - 사업명: 
                
                **심사 결과**
                - 부적합건수 : 
                - 최종 결과 : `,
            reminder_message_template:
                mtrim`### 심사 준비 현황
                

                ### 마지막 업데이트 후 진척사항
                -

                ### 리스크 및 이슈
                - `,
            reminder_timer_default_seconds: 24 * 60 * 60, // 1 day
            retrospective_template:
                mtrim`### 심사 준비
                -

                ### 진행 중 이슈
                -

                ### 향후 보완사항
                - `,
            retrospective_reminder_interval_seconds: 0, // Once
        },
    },
    //6/7 연구개발 템플릿 추가 중
    {
        title: '연구개발 프로젝트 수행',
        description: '연구개발 프로젝트 수행을 위한 플레이북입니다. 사업별로 적절하게 수정해서 사용할 수 있습니다.',
        icon: <Handshake/>,
        color: '#62697E14',
        author: 'komoon@koreanair.com',
        template: {
            ...emptyPlaybook(),
            title: '연구개발 프로젝트 수행',
            description: '연구개발 프로젝트 수행을 위한 플레이북입니다. 사업별로 적절하게 수정해서 사용할 수 있습니다.',
            checklists: [
                {
                    title: '실행계획 수립',
                    items: [
                        newChecklistItem('수행조직/인원별 업무분장 확인'),                        
                        newChecklistItem('Master Schedule 작성'),
                        newChecklistItem('투자 및 비용계획 작성'),
                        newChecklistItem('자료 관리 계획 작성'),
                        newChecklistItem('위험 및 이슈 관리계획 작성'),
                        newChecklistItem('형상관리 계획 작성'),
                        newChecklistItem('프로세스 테일러링'),
                        newChecklistItem('실행계획서 종합 및 품의'),
                    ],
                },
                {
                    title: 'Kickoff',
                    items: [
                        newChecklistItem(
                            '수검 당일 착수회의',
                            mtrim`심사 및 점검 중점에 따라 수정:
                            - 일정 계획
                            - 대상 사업 설명`,                            
                        ),
                        newChecklistItem('사업별 인터뷰'),                        
                    ],
                },
                {
                    title: '결과 정리',
                    items: [
                        newChecklistItem('결과 정리, 부적합 사항 도출'),
                        newChecklistItem('처리계획 요청'),                        
                        newChecklistItem('결과 보고서 작성 및 품의'),                        
                    ],
                },
                {
                    title: 'Follow up',
                    items: [
                        newChecklistItem('부적합 조치결과 확인'),                        
                    ],
                },
            ],
            create_public_playbook_run: true,
            channel_name_template: 'Audit: <name>',
            message_on_join_enabled: true,
            message_on_join:
                mtrim`안녕하세요!

                이 채널은 **심사 및 점검** 플레이북의 일부로 생성되어 관련 준비사항 및 수검 후속조치에 대한 커뮤니케이션을 목적으로 사용됩니다. 필요하다면 새 채널 멤버에게 전달할 메시지를 여기에 작성하세요. 메시지에는 마크다운 문법을 사용할 수 있습니다.`,
            run_summary_template_enabled: true,
            run_summary_template:
                mtrim`**심사 요약**
                나중에 참고할 수 있도록 금번 수검한 심사 개요와 경과에 대해 작성합니다.

                **대상 사업**
                - 사업명: 
                
                **심사 결과**
                - 부적합건수 : 
                - 최종 결과 : `,
            reminder_message_template:
                mtrim`### 심사 준비 현황
                

                ### 마지막 업데이트 후 진척사항
                -

                ### 리스크 및 이슈
                - `,
            reminder_timer_default_seconds: 24 * 60 * 60, // 1 day
            retrospective_template:
                mtrim`### 심사 준비
                -

                ### 진행 중 이슈
                -

                ### 향후 보완사항
                - `,
            retrospective_reminder_interval_seconds: 0, // Once
        },
    },
    // {
    //     title: 'Bug Bash',
    //     description: 'Customize this playbook to reflect your own bug bash process.',
    //     icon: <BugSearch/>,
    //     color: '#7A560014',
    //     author: <MattermostLogo/>,
    //     template: {
    //         ...emptyPlaybook(),
    //         title: 'Bug Bash',
    //         description: mtrim`About once or twice a month, the Mattermost Playbooks team uses this playbook to run a 50 minute bug-bash testing the latest version of Playbooks.

    //         Customize this playbook to reflect your own bug bash process.`,
    //         create_public_playbook_run: true,
    //         channel_name_template: 'Bug Bash (vX.Y)',
    //         checklists: [
    //             {
    //                 title: 'Setup Testing Environment (Before Meeting)',
    //                 items: [
    //                     newChecklistItem(
    //                         'Deploy the build in question to community-daily',
    //                     ),
    //                     newChecklistItem(
    //                         'Spin up a cloud instance running T0',
    //                         '',
    //                         '/cloud create playbooks-bug-bash-t0 --license te --image mattermost/mattermost-team-edition --test-data --version master',
    //                     ),
    //                     newChecklistItem(
    //                         'Spin up a cloud instance running E0',
    //                         '',
    //                         '/cloud create playbooks-bug-bash-e0 --license te --test-data --version master',
    //                     ),
    //                     newChecklistItem(
    //                         'Spin up a cloud instance running E10',
    //                         '',
    //                         '/cloud create playbooks-bug-bash-e10 --license e10 --test-data --version master',
    //                     ),
    //                     newChecklistItem(
    //                         'Spin up a cloud instance running E20',
    //                         '',
    //                         '/cloud create playbooks-bug-bash-e20 --license e20 --test-data --version master',
    //                     ),
    //                     newChecklistItem(
    //                         'Enable Open Servers & CRT for all Cloud Instances',
    //                         mtrim`From a command line, login to each server in turn via [\`mmctl\`](https://github.com/mattermost/mmctl), and configure, e.g.:
    //                             \`\`\`
    //                             for server in playbooks-bug-bash-t0 playbooks-bug-bash-e0 playbooks-bug-bash-e10 playbooks-bug-bash-e20; do
    //                                 mmctl auth login https://$server.test.mattermost.cloud --name $server --username sysadmin --password-file <(echo "Sys@dmin123");
    //                                 mmctl config set TeamSettings.EnableOpenServer true;
    //                                 mmctl config set ServiceSettings.CollapsedThreads default_on;
    //                             done
    //                             \`\`\``,
    //                     ),
    //                     newChecklistItem(
    //                         'Install the plugin to each instance',
    //                         mtrim`From a command line, login to each server in turn via [\`mmctl\`](https://github.com/mattermost/mmctl), and configure, e.g.:
    //                             \`\`\`
    //                             for server in playbooks-bug-bash-t0 playbooks-bug-bash-e0 playbooks-bug-bash-e10 playbooks-bug-bash-e20; do
    //                                 mmctl auth login https://$server.test.mattermost.cloud --name $server --username sysadmin --password-file <(echo "Sys@dmin123");
    //                                 mmctl plugin install-url --force https://github.com/mattermost/mattermost-plugin-playbooks/releases/download/v1.22.0%2Balpha.3/playbooks-1.22.0+alpha.3.tar.gz
    //                             done
    //                             \`\`\``,
    //                     ),
    //                     newChecklistItem(
    //                         'Announce Bug Bash',
    //                         'Make sure the team and community is aware of the upcoming bug bash.',
    //                     ),
    //                 ],
    //             },
    //             {
    //                 title: 'Define Scope (10 Minutes)',
    //                 items: [
    //                     newChecklistItem(
    //                         'Review GitHub commit diff',
    //                     ),
    //                     newChecklistItem(
    //                         'Identify new features to add to target testing areas checklist',
    //                     ),
    //                     newChecklistItem(
    //                         'Identify existing functionality to add to target testing areas checklist',
    //                     ),
    //                     newChecklistItem(
    //                         'Add relevant T0/E0/E10/E20 permutations',
    //                     ),
    //                     newChecklistItem(
    //                         'Assign owners',
    //                     ),
    //                 ],
    //             },
    //             {
    //                 title: 'Target Testing Areas (30 Minutes)',
    //                 items: [],
    //             },
    //             {
    //                 title: 'Triage (10 Minutes)',
    //                 items: [
    //                     newChecklistItem(
    //                         'Review issues to identify what to fix for the upcoming release',
    //                     ),
    //                     newChecklistItem(
    //                         'Assign owners for all required bug fixes',
    //                     ),
    //                 ],
    //             },
    //             {
    //                 title: 'Clean Up',
    //                 items: [
    //                     newChecklistItem(
    //                         'Clean up cloud instance running T0',
    //                         '',
    //                         '/cloud delete playbooks-bug-bash-t0',
    //                     ),
    //                     newChecklistItem(
    //                         'Clean up cloud instance running E0',
    //                         '',
    //                         '/cloud delete playbooks-bug-bash-e0',
    //                     ),
    //                     newChecklistItem(
    //                         'Clean up cloud instance running E10',
    //                         '',
    //                         '/cloud delete playbooks-bug-bash-e10',
    //                     ),
    //                     newChecklistItem(
    //                         'Clean up cloud instance running E20',
    //                         '',
    //                         '/cloud delete playbooks-bug-bash-e20',
    //                     ),
    //                 ],
    //             },
    //         ],
    //         status_update_enabled: true,
    //         message_on_join: mtrim`Welcome! We're using this channel to run a 50 minute bug-bash the new version of Playbooks. The first 10 minutes will be spent identifying scope and ownership, followed by 30 minutes of targeted testing in the defined areas, and 10 minutes of triage.

    //         When you find an issue, post a new thread in this channel tagged #bug and share any screenshots and reproduction steps. The owner of this bash will triage the messages into tickets as needed.`,
    //         message_on_join_enabled: true,
    //         retrospective_enabled: false,
    //         run_summary_template_enabled: true,
    //         run_summary_template: mtrim`The playbooks team is executing a bug bash to qualify the next shipping version.

    //         As we encounter issues, simply start a new thread and tag with #bug (or #feature) to make tracking these easier.

    //         **Release Link**: TBD
    //         **Zoom**: TBD
    //         **Triage Filter**: https://mattermost.atlassian.net/secure/RapidBoard.jspa?rapidView=68&projectKey=MM&view=planning.nodetail&quickFilter=332&issueLimit=100

    //         | Servers |
    //         | -- |
    //         | [T0](https://playbooks-bug-bash-t0.test.mattermost.cloud) |
    //         | [E0](https://playbooks-bug-bash-e0.test.mattermost.cloud) |
    //         | [E10](https://playbooks-bug-bash-e10.test.mattermost.cloud) |
    //         | [E20](https://playbooks-bug-bash-e20.test.mattermost.cloud) |

    //         Login with:

    //         | Username | Password |
    //         | -- | -- |
    //         | sysadmin | Sys@dmin123 |`,
    //     },
    // },
    {
        title: '플레이북 사용법 배우기',
        label: '처음 사용자들을 위한 학습용 플레이북',
        labelColor: '#E5AA1F29-#A37200',
        icon: <LightBulb/>,
        color: '#FFBC1F14',
        author: <MattermostLogo/>,
        description: '플레이북 개념이 익숙하지 않습니까? 이 플레이북이 개념과 설정, 플레이북 Run에 대한 이해를 도와줄 수 있습니다.',
        template: {
            ...emptyPlaybook(),
            title: '플레이북 사용법 배우기',
            description: mtrim`이 플레이북으로 플레이북 사용법을 배워보세요. 페이지 내용을 한번 쭉 살펴보거나 상단 오른쪽 구석의 'Test Run 시작' 버튼을 클릭하세요.`,
            create_public_playbook_run: true,
            channel_name_template: '온보딩 Run',
            checklists: [
                {
                    title: '배워보기',
                    items: [
                        newChecklistItem(
                            '이 페이지의 상단 섹션에서 Run 이름 또는 설명을 수정해 보세요.',
                        ),
                        newChecklistItem(
                            '처음 두 가지 작업을 완료로 체크해 보세요.',
                        ),
                        newChecklistItem(
                            '본인 또는 다른 멤버에게 작업을 할당해보세요.',
                        ),
                        newChecklistItem(
                            '첫번째 상태 업데이트를 게시하세요.',
                        ),
                        newChecklistItem(
                            '체크리스트를 완료하세요.',
                        ),
                    ],
                },
                {
                    title: '협업',
                    items: [
                        newChecklistItem(
                            '협업하고 싶은 팀 멤버를 초대해보세요.',
                        ),
                        newChecklistItem(
                            '이 Task를 Skip해보세요.',
                        ),
                        newChecklistItem(
                            'Run을 완료해보세요.',
                        ),
                    ],
                },
            ],
            status_update_enabled: true,
            reminder_timer_default_seconds: 50 * 60, // 50 minutes
            message_on_join: '',
            message_on_join_enabled: false,
            retrospective_enabled: false,
            run_summary_template_enabled: true,
            run_summary_template: mtrim`이 요약 영역은 관련된 모든 사람들이 한 눈에 맥락을 파악할 수 있도록 도와줍니다. 채널 메시지와 마찬가지로 마크다운 구문을 지원하므로 클릭하여 편집하고 사용해 보세요.

            - 시작 날짜: 
            - 완료 목표 날짜: TBD`,
        },
    },
]);

export default PresetTemplates;
